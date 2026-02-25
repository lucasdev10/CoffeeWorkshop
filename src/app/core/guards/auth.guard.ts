import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@app/features/auth/store/auth.store';

/**
 * Guard para proteger rotas que requerem autenticação
 * Exemplo de uso nas rotas:
 * { path: 'admin', canActivate: [authGuard], ... }
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
