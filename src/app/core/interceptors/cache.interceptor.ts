import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

/**
 * Cache simples para requisições HTTP
 */
const cache = new Map<string, HttpResponse<unknown>>();

/**
 * Interceptor para cache de requisições GET
 */
export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  // Apenas cacheia requisições GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // Verifica se tem header para ignorar cache
  if (req.headers.has('X-Skip-Cache')) {
    return next(req);
  }

  // Verifica se existe no cache
  const cachedResponse = cache.get(req.url);
  if (cachedResponse) {
    return of(cachedResponse.clone());
  }

  // Faz a requisição e armazena no cache
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, event.clone());
      }
    }),
  );
};

/**
 * Limpa o cache
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Remove item específico do cache
 */
export function removeCacheItem(url: string): void {
  cache.delete(url);
}
