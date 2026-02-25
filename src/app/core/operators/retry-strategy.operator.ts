import { MonoTypeOperatorFunction, Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

/**
 * Configuração de retry
 */
export interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  backoff?: boolean;
  excludedStatusCodes?: number[];
}

/**
 * Operador RxJS para retry com backoff exponencial
 *
 * Uso:
 * this.http.get('/api/data').pipe(
 *   retryStrategy({ maxRetries: 3, delay: 1000, backoff: true })
 * )
 */
export function retryStrategy<T>(config: RetryConfig = {}): MonoTypeOperatorFunction<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    excludedStatusCodes = [400, 401, 403, 404],
  } = config;

  return (source: Observable<T>) =>
    source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error, index) => {
            const retryAttempt = index + 1;

            // Não retenta se atingiu o máximo
            if (retryAttempt > maxRetries) {
              return throwError(() => error);
            }

            // Não retenta para status codes específicos
            if (error.status && excludedStatusCodes.includes(error.status)) {
              return throwError(() => error);
            }

            // Calcula delay com backoff exponencial
            const retryDelay = backoff ? delay * Math.pow(2, index) : delay;

            console.log(`Retry attempt ${retryAttempt}/${maxRetries} after ${retryDelay}ms`, error);

            return timer(retryDelay);
          }),
        ),
      ),
    );
}

/**
 * Retry simples sem backoff
 */
export function simpleRetry<T>(maxRetries = 3): MonoTypeOperatorFunction<T> {
  return retryStrategy({ maxRetries, delay: 1000, backoff: false });
}

/**
 * Retry com backoff exponencial
 */
export function exponentialBackoff<T>(maxRetries = 3): MonoTypeOperatorFunction<T> {
  return retryStrategy({ maxRetries, delay: 1000, backoff: true });
}
