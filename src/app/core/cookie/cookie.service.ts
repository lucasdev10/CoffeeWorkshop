import { Injectable } from '@angular/core';

/**
 * Opções para configuração de cookies
 */
export interface CookieOptions {
  expires?: Date | number; // Data de expiração ou dias
  path?: string;
  domain?: string;
  secure?: boolean; // Apenas HTTPS
  httpOnly?: boolean; // Não acessível via JavaScript (apenas server-side)
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Serviço seguro para gerenciamento de cookies
 * Substitui localStorage com maior segurança
 */
@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private readonly defaultOptions: CookieOptions = {
    path: '/',
    secure: this.isSecureContext(),
    sameSite: 'strict',
    expires: 7, // 7 dias por padrão
  };

  /**
   * Define um cookie com opções de segurança
   */
  set<T>(name: string, value: T, options: CookieOptions = {}): boolean {
    try {
      const serializedValue = JSON.stringify(value);
      const opts = { ...this.defaultOptions, ...options };
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(serializedValue)}`;

      if (opts.expires) {
        const expirationDate = this.getExpirationDate(opts.expires);
        cookieString += `; expires=${expirationDate.toUTCString()}`;
      }

      if (opts.path) {
        cookieString += `; path=${opts.path}`;
      }

      if (opts.domain) {
        cookieString += `; domain=${opts.domain}`;
      }

      if (opts.secure) {
        cookieString += '; secure';
      }

      if (opts.sameSite) {
        cookieString += `; samesite=${opts.sameSite}`;
      }

      // httpOnly não pode ser definido via JavaScript
      // Deve ser configurado no servidor

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.error(`Error setting cookie ${name}:`, error);
      return false;
    }
  }

  /**
   * Obtém valor de um cookie
   */
  get<T>(name: string): T | null {
    try {
      const encodedName = encodeURIComponent(name);
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.trim().split('=');
        if (cookieName === encodedName) {
          const serializedValue = decodeURIComponent(cookieValue || '');
          return JSON.parse(serializedValue);
        }
      }

      return null;
    } catch (error) {
      console.error(`Error getting cookie ${name}:`, error);
      return null;
    }
  }

  /**
   * Remove um cookie
   */
  remove(name: string, options: Partial<CookieOptions> = {}): boolean {
    try {
      const opts = { ...this.defaultOptions, ...options };
      return this.set(name, '', {
        ...opts,
        expires: new Date(0), // Data no passado
      });
    } catch (error) {
      console.error(`Error removing cookie ${name}:`, error);
      return false;
    }
  }

  /**
   * Verifica se um cookie existe
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Remove todos os cookies do domínio atual
   */
  clear(): boolean {
    try {
      const cookies = document.cookie.split(';');

      for (const cookie of cookies) {
        const [name] = cookie.trim().split('=');
        if (name) {
          this.remove(decodeURIComponent(name));
        }
      }

      return true;
    } catch (error) {
      console.error('Error clearing cookies:', error);
      return false;
    }
  }

  /**
   * Obtém todos os cookies como objeto
   */
  getAll(): Record<string, string> {
    try {
      const cookies: Record<string, string> = {};
      const cookieStrings = document.cookie.split(';');

      for (const cookie of cookieStrings) {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }

      return cookies;
    } catch (error) {
      console.error('Error getting all cookies:', error);
      return {};
    }
  }

  /**
   * Verifica se estamos em contexto seguro (HTTPS)
   */
  private isSecureContext(): boolean {
    return location.protocol === 'https:' || location.hostname === 'localhost';
  }

  /**
   * Converte expires em Date
   */
  private getExpirationDate(expires: Date | number): Date {
    if (expires instanceof Date) {
      return expires;
    }

    const date = new Date();
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
    return date;
  }
}
