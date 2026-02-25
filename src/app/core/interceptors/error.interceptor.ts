import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor para tratamento global de erros HTTP
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        errorMessage = `Server Error: ${error.status} - ${error.message}`;

        // Tratamento específico por status code
        switch (error.status) {
          case 401:
            // Não autorizado - redirecionar para login
            router.navigate(['/login']);
            break;
          case 403:
            // Proibido - sem permissão
            router.navigate(['/unauthorized']);
            break;
          case 404:
            // Não encontrado
            console.error('Resource not found');
            break;
          case 500:
            // Erro interno do servidor
            console.error('Internal server error');
            break;
        }
      }

      console.error(errorMessage);
      return throwError(() => error);
    }),
  );
};
