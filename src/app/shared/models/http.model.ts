import { Observable } from 'rxjs';

export interface IHttpService<T> {
  get(url: string): Observable<T>;
  getById(url: string, id: string): Observable<T>;
  post(url: string, item: T): Observable<T>;
  put(url: string, id: string, item: T): Observable<T>;
  delete(url: string, id: string): Observable<void>;
}
