import { inject, Injectable } from '@angular/core';
import { IHttpService } from '@app/shared/models/http.model';
import { delay, Observable, of, throwError } from 'rxjs';
import { MockDataService, STORAGE_MOCK } from '../data/mock-data.service';
import { Utils } from './../../shared/utils/utils';

/**
 * Serviço centralizado para requisições HTTP
 * Simula comportamento de API real com delays e possíveis erros
 */
@Injectable({
  providedIn: 'root',
})
export class HttpService<T extends { id?: string }> implements IHttpService<T> {
  private readonly DELAY_MS = 500; // Simula latência de rede

  constructor() {
    inject(MockDataService);
  }

  /**
   * GET - Busca dados por chave
   */
  get<T>(url: string): Observable<T> {
    const data = STORAGE_MOCK.get(url);

    if (!data) {
      return throwError(() => ({
        status: 404,
        message: `Resource '${url}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    return of(data as T).pipe(delay(this.DELAY_MS));
  }

  /**
   * GET BY ID - Busca item específico em uma coleção
   */
  getById<T>(url: string, id: string): Observable<T> {
    const collection = STORAGE_MOCK.get(url) as T[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${url}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const item = collection.find((item: T) => (item as { id: string }).id === id);

    if (!item) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found in '${url}'`,
      })).pipe(delay(this.DELAY_MS));
    }

    return of(item).pipe(delay(this.DELAY_MS));
  }

  /**
   * POST - Adiciona novo item à coleção
   */
  post<T extends { id?: string }>(url: string, item: T): Observable<T> {
    const collection = (STORAGE_MOCK.get(url) as T[]) || [];

    // Gera ID se não existir
    if (!item.id) {
      item.id = Utils.generateId();
    }

    collection.push(item);
    STORAGE_MOCK.set(url, collection);

    return of(item).pipe(delay(this.DELAY_MS));
  }

  /**
   * PUT - Atualiza item existente
   */
  put<T extends { id?: string }>(url: string, id: string, item: T): Observable<T> {
    const collection = STORAGE_MOCK.get(url) as T[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${url}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const index = collection.findIndex((i: T) => i.id === id);

    if (index === -1) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    collection[index] = { ...collection[index], ...item, id };
    STORAGE_MOCK.set(url, collection);

    return of(collection[index]).pipe(delay(this.DELAY_MS));
  }

  /**
   * DELETE - Remove item da coleção
   */
  delete(url: string, id: string): Observable<void> {
    const collection = STORAGE_MOCK.get(url) as { id: string }[];

    if (!collection) {
      return throwError(() => ({
        status: 404,
        message: `Collection '${url}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    const filtered = collection.filter((item) => item.id !== id);

    if (filtered.length === collection.length) {
      return throwError(() => ({
        status: 404,
        message: `Item with id '${id}' not found`,
      })).pipe(delay(this.DELAY_MS));
    }

    STORAGE_MOCK.set(url, filtered);
    return of(void 0).pipe(delay(this.DELAY_MS));
  }
}
