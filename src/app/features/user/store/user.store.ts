import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ICreateUserDto, IUpdateUserDto, IUser, IUserFilters } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

/**
 * Estado de loading
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Estado da store de usuários
 */
interface IUserState {
  users: IUser[];
  selectedUser: IUser | null;
  filters: IUserFilters;
  loading: LoadingState;
  error: string | null;
}

/**
 * Store de usuários usando Signals
 * Gerencia estado global dos usuários de forma reativa
 * Preparado para migração futura para NgRx
 */
@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private readonly destroyRef = inject(DestroyRef);
  private readonly repository = inject(UserRepository);

  // Estado privado (writable signals)
  private readonly state = signal<IUserState>({
    users: [],
    selectedUser: null,
    filters: {},
    loading: 'idle',
    error: null,
  });

  // Selectores públicos (readonly computed signals)
  readonly users = computed(() => this.state().users);
  readonly selectedUser = computed(() => this.state().selectedUser);
  readonly filters = computed(() => this.state().filters);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isLoading = computed(() => this.state().loading === 'loading');
  readonly hasError = computed(() => this.state().error !== null);

  // Computed: usuários filtrados
  readonly filteredUsers = computed(() => {
    const users = this.users();
    const filters = this.filters();

    return users.filter((user) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = user.fullName.toLowerCase().includes(searchLower);
        const matchesDescription = user.email.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  });

  // Computed: contagem de usuários
  readonly userCount = computed(() => this.users().length);
  readonly filteredUserCount = computed(() => this.filteredUsers().length);

  constructor() {
    // Auto-carrega usuários na inicialização
    this.loadUsers();
  }

  /**
   * Actions - Métodos que modificam o estado
   */

  loadUsers(): void {
    this.setLoading('loading');

    this.repository
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.state.update((state) => ({
            ...state,
            users,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to load users',
          }));
        },
      });
  }

  loadUserById(id: string): void {
    this.setLoading('loading');

    this.repository
      .findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.state.update((state) => ({
            ...state,
            selectedUser: user,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to load user',
          }));
        },
      });
  }

  createUser(dto: ICreateUserDto): void {
    this.setLoading('loading');

    this.repository
      .create(dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user) => {
          this.state.update((state) => ({
            ...state,
            users: [...state.users, user],
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to create user',
          }));
        },
      });
  }

  updateUser(id: string, dto: IUpdateUserDto): void {
    this.setLoading('loading');

    this.repository
      .update(id, dto)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updatedUser) => {
          this.state.update((state) => ({
            ...state,
            users: state.users.map((u) => (u.id === id ? updatedUser : u)),
            selectedUser: state.selectedUser?.id === id ? updatedUser : state.selectedUser,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to update user',
          }));
        },
      });
  }

  deleteUser(id: string): void {
    this.setLoading('loading');

    this.repository
      .delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state.update((state) => ({
            ...state,
            users: state.users.filter((u) => u.id !== id),
            selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
            loading: 'success',
            error: null,
          }));
        },
        error: (error) => {
          this.state.update((state) => ({
            ...state,
            loading: 'error',
            error: error.message || 'Failed to delete user',
          }));
        },
      });
  }

  setFilters(filters: IUserFilters): void {
    this.state.update((state) => ({
      ...state,
      filters: { ...state.filters, ...filters },
    }));
  }

  clearFilters(): void {
    this.state.update((state) => ({
      ...state,
      filters: {},
    }));
  }

  clearError(): void {
    this.state.update((state) => ({
      ...state,
      error: null,
    }));
  }

  private setLoading(loading: LoadingState): void {
    this.state.update((state) => ({
      ...state,
      loading,
    }));
  }
}
