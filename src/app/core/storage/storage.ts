import { Injectable } from '@angular/core';

/**
 * Serviço de armazenamento local com tratamento de erros
 * Abstrai o localStorage para facilitar testes e troca futura
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService<T = unknown> {
  /**
   * Busca valor do localStorage
   */
  get(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        return null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  /**
   * Salva valor no localStorage
   */
  set(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage (key: ${key}):`, error);
      // Pode ser quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded');
      }
      return false;
    }
  }

  /**
   * Remove valor do localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
      return false;
    }
  }

  /**
   * Limpa todo o localStorage
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Verifica se uma chave existe
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  /**
   * Retorna todas as chaves
   */
  keys(): string[] {
    return Object.keys(localStorage);
  }
}
