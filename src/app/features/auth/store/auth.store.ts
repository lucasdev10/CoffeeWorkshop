import { computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { StorageService } from '@app/core/storage/storage';
import { EUserRole, IUser } from '@app/features/user/models/user.model';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { IAuthStoreState, ILoginCredentials } from '../models/auth.model';
import { AuthRepository } from '../repositories/auth.repository';

/**
 * Estado inicial da store de usuários
 */
const initialState: IAuthStoreState = {
  user: null,
  token: null,
  loading: 'idle',
  error: null,
};

/**
 * Store de Autenticação usando SignalStore
 * Gerencia estado global de autenticação de forma reativa
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    user: computed(() => store.user()),
    token: computed(() => store.token()),
    isLoading: computed(() => store.loading() === 'loading'),
    error: computed(() => store.error()),
    isAuthenticated: computed(() => !!store.user() && !!store.token()),
    isAdmin: computed(() => store.user()?.role === EUserRole.ADMIN),
  })),
  withMethods(
    (
      store,
      storage = inject(StorageService),
      repository = inject(AuthRepository),
      router = inject(Router),
      destroyRef = inject(DestroyRef),
    ) => ({
      /**
       * Inicializa autenticação do localStorage
       */
      _initializeAuth(): void {
        const token = storage.get('auth_token') as string | null;
        const user = storage.get('auth_user') as IUser | null;

        if (token && user) {
          patchState(store, { token, user });
        }
      },
      /**
       * Realiza login
       */
      login(credentials: ILoginCredentials): void {
        patchState(store, { loading: 'loading', error: null });

        repository
          .login(credentials)
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: ({ user, token }) => {
              patchState(store, { user, token });

              // Persiste no localStorage
              storage.set('auth_token', token);
              storage.set('auth_user', user);

              patchState(store, { loading: 'success' });

              // Redireciona baseado no role
              if (user.role === EUserRole.ADMIN) {
                router.navigate(['/admin']);
              } else {
                router.navigate(['/products']);
              }
            },
            error: (error) => {
              patchState(store, {
                error: error.message || 'Error when logging in',
                loading: 'error',
              });
            },
          });
      },
      /**
       * Realiza logout
       */
      logout(): void {
        patchState(store, { loading: 'loading' });

        repository
          .logout()
          .pipe(takeUntilDestroyed(destroyRef))
          .subscribe({
            next: () => {
              this._clearAuth();
              router.navigate(['/auth/login']);
            },
            error: () => {
              // Mesmo com erro, limpa autenticação
              this._clearAuth();
              router.navigate(['/auth/login']);
            },
          });
      },
      /**
       * Limpa estado de autenticação
       */
      _clearAuth(): void {
        patchState(store, { user: null, token: null, loading: 'idle', error: null });

        storage.remove('auth_token');
        storage.remove('auth_user');
      },
      /**
       * Limpa erro
       */
      _clearError(): void {
        patchState(store, { error: null });
      },
    }),
  ),
  withHooks((store) => ({
    onInit: () => {
      store._initializeAuth();
    },
  })),
);
