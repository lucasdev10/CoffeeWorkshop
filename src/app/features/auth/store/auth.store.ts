import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '@app/core/cookie/cookie.service';
import { EUserRole, IUser } from '@app/features/user/models/user.model';
import { ILoginCredentials } from '../models/auth.model';
import { AuthRepository } from '../repositories/auth.repository';

/**
 * Store de autenticação usando Signals
 * Gerencia estado de autenticação da aplicação
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly repository = inject(AuthRepository);
  private readonly cookies = inject(CookieService);
  private readonly router = inject(Router);

  // State
  private readonly userState = signal<IUser | null>(null);
  private readonly tokenState = signal<string | null>(null);
  private readonly loadingState = signal<boolean>(false);
  private readonly errorState = signal<string | null>(null);

  // Computed signals
  readonly user = computed(() => this.userState());
  readonly token = computed(() => this.tokenState());
  readonly isLoading = computed(() => this.loadingState());
  readonly error = computed(() => this.errorState());
  readonly isAuthenticated = computed(() => !!this.userState() && !!this.tokenState());
  readonly isAdmin = computed(() => this.userState()?.role === EUserRole.ADMIN);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Inicializa autenticação do cookieService
   */
  private initializeAuth(): void {
    const token = this.cookies.get('auth_token') as string | null;
    const user = this.cookies.get('auth_user') as IUser | null;

    if (token && user) {
      this.tokenState.set(token);
      this.userState.set(user);
    }
  }

  /**
   * Realiza login
   */
  login(credentials: ILoginCredentials): void {
    this.loadingState.set(true);
    this.errorState.set(null);

    this.repository.login(credentials).subscribe({
      next: (response) => {
        this.userState.set(response.user);
        this.tokenState.set(response.token);

        // Persiste nos cookies
        this.cookies.set<string>('auth_token', response.token);
        this.cookies.set<IUser>('auth_user', response.user);

        this.loadingState.set(false);

        // Redireciona baseado no role
        if (response.user.role === EUserRole.ADMIN) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.errorState.set(error.message || 'Error when logging in');
        this.loadingState.set(false);
      },
    });
  }

  /**
   * Realiza logout
   */
  logout(): void {
    this.loadingState.set(true);

    this.repository.logout().subscribe({
      next: () => {
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Mesmo com erro, limpa autenticação
        this.clearAuth();
        this.router.navigate(['/auth/login']);
      },
    });
  }

  /**
   * Limpa estado de autenticação
   */
  private clearAuth(): void {
    this.userState.set(null);
    this.tokenState.set(null);
    this.loadingState.set(false);
    this.errorState.set(null);

    this.cookies.remove('auth_token');
    this.cookies.remove('auth_user');
  }

  /**
   * Limpa erro
   */
  clearError(): void {
    this.errorState.set(null);
  }
}
