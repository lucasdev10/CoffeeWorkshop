import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Interceptor para adicionar token de autenticação nas requisições
 * Registrar no app.config.ts:
 * provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: Buscar token do AuthService ou localStorage
  const token = localStorage.getItem('auth_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
