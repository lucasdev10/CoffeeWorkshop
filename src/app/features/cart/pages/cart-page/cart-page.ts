import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-cart-page',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    CurrencyPipe,
  ],
  templateUrl: './cart-page.html',
  styleUrl: './cart-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CartPage {
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);

  // Expõe signals para o template
  readonly items = this.cartStore.items;
  readonly subtotal = this.cartStore.subtotal;
  readonly shipping = this.cartStore.shipping;
  readonly tax = this.cartStore.tax;
  readonly total = this.cartStore.total;
  readonly itemCount = this.cartStore.itemCount;
  readonly isEmpty = this.cartStore.isEmpty;
  readonly hasFreeShipping = this.cartStore.hasFreeShipping;

  onRemoveItem(productId: string): void {
    this.cartStore.removeItem(productId);
  }

  onUpdateQuantity(productId: string, quantity: number): void {
    this.cartStore.updateQuantity(productId, quantity);
  }

  onIncrement(productId: string): void {
    this.cartStore.incrementQuantity(productId);
  }

  onDecrement(productId: string): void {
    this.cartStore.decrementQuantity(productId);
  }

  onClearCart(): void {
    this.cartStore.clear();
  }

  onContinueShopping(): void {
    this.router.navigate(['/product/list']);
  }

  onCheckout(): void {
    // TODO: Implementar checkout
    console.log('Checkout:', this.cartStore.items());
  }
}
