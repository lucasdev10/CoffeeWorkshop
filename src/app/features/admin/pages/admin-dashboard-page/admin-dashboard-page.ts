import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CartStore } from '@app/features/cart/store/cart.store';
import { ProductFacade } from '@app/features/products/store';

@Component({
  selector: 'app-admin-dashboard-page',
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterLink, CurrencyPipe, AsyncPipe],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdminDashboardPageComponent {
  private readonly productFacade = inject(ProductFacade);
  private readonly cartStore = inject(CartStore);

  readonly totalProducts$ = this.productFacade.totalProducts$;
  readonly totalValue$ = this.productFacade.totalValue$;
  readonly lowStockProducts$ = this.productFacade.lowStockProducts$;

  readonly totalOrders = computed(() => this.cartStore.itemCount());

  constructor() {
    this.productFacade.loadProducts();
  }
}
