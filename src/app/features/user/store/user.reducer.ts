import { createReducer, on } from '@ngrx/store';
import { UserActions } from './user.actions';
import { initialUserState } from './user.state';

/**
 * Reducer da feature de usuários
 * Gerencia as transições de estado baseado nas actions
 */
export const userReducer = createReducer(
  initialUserState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),

  // Load User By Id
  on(UserActions.loadUserById, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.loadUserByIdSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.loadUserByIdFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),

  // Create User
  on(UserActions.createUser, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.createUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.createUserFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),

  // Update User
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: state.selectedUser?.id === user.id ? user : state.selectedUser,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),

  // Delete User
  on(UserActions.deleteUser, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    loading: 'success' as const,
    error: null,
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: 'error' as const,
    error,
  })),

  // Filters
  on(UserActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
  })),
  on(UserActions.clearFilters, (state) => ({
    ...state,
    filters: {},
  })),

  // Error Handling
  on(UserActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
