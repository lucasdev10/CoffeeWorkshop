import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartStore } from '@app/features/cart/store/cart.store';
import { ProductCardComponent } from '../../components/product-card/product-card';
import { IProduct } from '../../models/product.model';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-list-page',
  imports: [ProductCardComponent, MatProgressSpinnerModule],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPageComponent {
  private readonly productStore = inject(ProductStore);
  private readonly cartStore = inject(CartStore);

  // Expõe signals da store para o template
  readonly products = this.productStore.filteredProducts;
  readonly isLoading = this.productStore.isLoading;
  readonly error = this.productStore.error;

  onAddToCart(product: IProduct): void {
    this.cartStore.addItem(product, 1);
  }
}
