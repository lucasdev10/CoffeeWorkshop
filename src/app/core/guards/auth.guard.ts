import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '@app/features/auth/store';

/**
 * Guard para proteger rotas que requerem autenticação
 * Exemplo de uso nas rotas:
 * { path: 'admin', canActivate: [authGuard], ... }
 */
export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authFacade = inject(AuthFacade);

  const isAuthenticated = await authFacade.isAuthenticated();

  if (!isAuthenticated) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
