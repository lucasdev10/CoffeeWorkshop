import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@app/features/auth/store/auth.store';

/**
 * Guard para verificar permissões/roles do usuário
 * Exemplo de uso:
 * { path: 'admin', canActivate: [roleGuard], data: { roles: ['ADMIN'] } }
 */
export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  const user = authStore.user();
  if (!user) {
    router.navigate(['/auth/login']);
    return false;
  }

  const hasRole = requiredRoles.includes(user.role);

  if (!hasRole) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};
