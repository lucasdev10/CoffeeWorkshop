import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/product', pathMatch: 'full' },
  {
    path: 'product',
    loadChildren: () => import('./features/products/products.route').then((r) => r.PRODUCT_ROUTES),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/pages/cart-page/cart-page').then((c) => c.CartPage),
  },
  { path: '**', redirectTo: '/product' },
];
