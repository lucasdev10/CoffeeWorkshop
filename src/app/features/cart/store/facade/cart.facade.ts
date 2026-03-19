import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from '@app/core/storage/storage';
import { CartDomainService } from '@app/domain/cart/cart-domain.service';
import { IProduct } from '@app/features/products/models/product.model';
import { APP_CONFIG } from '@app/shared/config/app.config';
import { Store } from '@ngrx/store';
import { firstValueFrom, map } from 'rxjs';
import { ICart, ICartItem } from '../../models/cart.model';
import { CartActions } from '../cart.actions';
import {
  selectIsEmpty,
  selectItemCount,
  selectItems,
  selectShipping,
  selectState,
  selectSubtotal,
  selectTax,
  selectTotal,
} from '../selectors/cart.selectors';

@Injectable({ providedIn: 'root' })
export class CartFacade {
  private readonly store = inject(Store);
  private readonly cartDomainService = inject(CartDomainService);
  private readonly storageService = inject(StorageService<ICart>);
  private readonly STORAGE_KEY = APP_CONFIG.storage.CART_KEY;
  private readonly destroyRef = inject(DestroyRef);

  private readonly state$ = this.store.select(selectState);

  readonly items$ = this.store.select(selectItems);
  readonly subtotal$ = this.store.select(selectSubtotal);
  readonly shipping$ = this.store.select(selectShipping);
  readonly tax$ = this.store.select(selectTax);
  readonly total$ = this.store.select(selectTotal);
  readonly itemCount$ = this.store.select(selectItemCount);
  readonly isEmpty$ = this.store.select(selectIsEmpty);
  readonly hasFreeShipping$ = this.subtotal$.pipe(
    map((subtotal) => this.cartDomainService.qualifiesForFreeShipping(subtotal)),
  );

  constructor() {
    this.store.dispatch(CartActions.loadCartFromStorage({ cart: this.loadFromStorage() }));

    this.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((cart) => {
      this.storageService.set(this.STORAGE_KEY, cart);
    });
  }

  async addItem(product: IProduct, quantity = 1): Promise<void> {
    const currentItems = await firstValueFrom(this.items$);

    const validationResult = this.canAddProduct(product.id, quantity, currentItems, product.stock);

    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join('; '));
    }

    const existingItemIndex = currentItems.findIndex((item) => item.product.id === product.id);

    let updatedItems: ICartItem[];

    if (existingItemIndex !== -1) {
      const existingItem = currentItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;

      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: newQuantity,
              subtotal: newQuantity * product.price,
            }
          : item,
      );
    } else {
      const newItem: ICartItem = {
        product,
        quantity,
        subtotal: product.price * quantity,
      };
      updatedItems = [...currentItems, newItem];
    }

    this.updateCart(updatedItems);
  }

  async removeItem(productId: string): Promise<void> {
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    const items = await firstValueFrom(this.items$);
    const updatedItems = items.filter((item) => item.product.id !== productId);
    this.updateCart(updatedItems);
  }

  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (!productId?.trim()) {
      throw new Error('Product ID is required');
    }

    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = await firstValueFrom(this.items$);
    const existingItem = currentItems.find((item) => item.product.id === productId);

    if (!existingItem) {
      throw new Error('Product not found in cart');
    }

    // Criar um item temporário para validação
    const tempItem: ICartItem = {
      ...existingItem,
      quantity,
      subtotal: existingItem.product.price * quantity,
    };

    // Usar domain service para validar o item
    const validationResult = this.cartDomainService.validateCartItem(tempItem);
    if (!validationResult.isValid) {
      throw new Error(validationResult.errors.join('; '));
    }

    const updatedItems = currentItems.map((item) =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            subtotal: item.product.price * quantity,
          }
        : item,
    );

    this.updateCart(updatedItems);
  }

  async incrementQuantity(productId: string): Promise<void> {
    const items = await firstValueFrom(this.items$);
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  async decrementQuantity(productId: string): Promise<void> {
    const items = await firstValueFrom(this.items$);
    const item = items.find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  clear(): void {
    this.updateCart([]);
  }

  private updateCart(items: ICartItem[]): void {
    const validationResult = this.validateCurrentCart(items);

    if (!validationResult.isValid) {
      throw new Error(`Cart validation failed: ${validationResult.errors.join('; ')}`);
    }

    const calculations = this.cartDomainService.calculateCartTotals(items);

    const cart = {
      items,
      subtotal: calculations.subtotal,
      shipping: calculations.shipping,
      tax: calculations.tax,
      total: calculations.total,
      itemCount: calculations.itemCount,
    };

    this.store.dispatch(CartActions.updateCart({ cart }));
  }

  private loadFromStorage(): ICart {
    try {
      const stored = this.storageService.get(this.STORAGE_KEY);
      return (
        stored || {
          items: [],
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
          itemCount: 0,
        }
      );
    } catch {
      return {
        items: [],
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
      };
    }
  }

  private validateCurrentCart(items: ICartItem[]): { isValid: boolean; errors: string[] } {
    return this.cartDomainService.validateCart(items);
  }

  private canAddProduct(
    productId: string,
    quantity: number,
    items: ICartItem[],
    productStock: number,
  ): { isValid: boolean; errors: string[] } {
    return this.cartDomainService.canAddProductToCart(productId, quantity, items, productStock);
  }
}
