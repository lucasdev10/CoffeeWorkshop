import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthResponse, LoginCredentials, User, UserRole } from '../models/auth.model';

/**
 * Repository para autenticação
 * Simula chamadas de API - substituir por API real no futuro
 */
@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  // Mock de usuários (substituir por API real)
  private readonly mockUsers = [
    {
      id: '1',
      email: 'admin@admin.com',
      password: 'admin123',
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
    {
      id: '2',
      email: 'user@user.com',
      password: 'user123',
      name: 'Regular User',
      role: UserRole.USER,
    },
  ];

  /**
   * Realiza login
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Simula delay de rede
    return new Observable<AuthResponse>((observer) => {
      setTimeout(() => {
        const user = this.mockUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password,
        );

        if (!user) {
          observer.error({ message: 'Email ou senha inválidos' });
          return;
        }

        const { ...userWithoutPassword } = user;
        const response: AuthResponse = {
          user: userWithoutPassword,
          token: `mock-jwt-token-${user.id}`,
          refreshToken: `mock-refresh-token-${user.id}`,
        };

        observer.next(response);
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Realiza logout
   */
  logout(): Observable<void> {
    return of(void 0).pipe(delay(300));
  }

  /**
   * Valida token
   */
  validateToken(token: string): Observable<User> {
    // Simula validação de token
    return new Observable<User>((observer) => {
      setTimeout(() => {
        if (!token || !token.startsWith('mock-jwt-token-')) {
          observer.error({ message: 'Token inválido' });
          return;
        }

        const userId = token.replace('mock-jwt-token-', '');
        const user = this.mockUsers.find((u) => u.id === userId);

        if (!user) {
          observer.error({ message: 'Usuário não encontrado' });
          return;
        }

        const { ...userWithoutPassword } = user;
        observer.next(userWithoutPassword);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Refresh token
   */
  refreshToken(): Observable<AuthResponse> {
    return throwError(() => ({ message: 'Not implemented' }));
  }
}
