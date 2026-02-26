import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'create',
    loadComponent: () =>
      import('./pages/user-form-page/user-form-page').then((c) => c.UserFormPageComponent),
  },
];
