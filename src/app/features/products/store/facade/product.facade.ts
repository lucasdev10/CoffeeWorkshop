import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { ICreateProductDto, IProductFilters, IUpdateProductDto } from '../../models/product.model';
import { ProductActions } from '../product.actions';
import {
  selectError,
  selectFilteredProducts,
  selectIsLoading,
  selectLowStockProducts,
  selectProducts,
  selectSelectedProduct,
  selectTotalProducts,
  selectTotalValue,
} from '../selectors/product.selectors';

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly store = inject(Store);

  readonly products$ = this.store.select(selectProducts);
  readonly filteredProducts$ = this.store.select(selectFilteredProducts);
  readonly isLoading$ = this.store.select(selectIsLoading);
  readonly error$ = this.store.select(selectError);
  readonly selectedProduct$ = this.store.select(selectSelectedProduct);
  readonly totalProducts$ = this.store.select(selectTotalProducts);
  readonly totalValue$ = this.store.select(selectTotalValue);
  readonly lowStockProducts$ = this.store.select(selectLowStockProducts);
  readonly productWithLoading$ = combineLatest([this.selectedProduct$, this.isLoading$]).pipe(
    map(([product, isLoading]) => ({ product, isLoading })),
  );

  loadProducts(): void {
    this.store.dispatch(ProductActions.loadProducts());
  }

  loadProductById(id: string): void {
    this.store.dispatch(ProductActions.loadProductById({ id }));
  }

  createProduct(product: ICreateProductDto): void {
    this.store.dispatch(ProductActions.createProduct({ product }));
  }

  updateProduct(id: string, product: IUpdateProductDto): void {
    this.store.dispatch(ProductActions.updateProduct({ id, product }));
  }

  deleteProduct(id: string): void {
    this.store.dispatch(ProductActions.deleteProduct({ id }));
  }

  setFilters(filters: IProductFilters): void {
    this.store.dispatch(ProductActions.setProductFilters({ filters }));
  }
}
