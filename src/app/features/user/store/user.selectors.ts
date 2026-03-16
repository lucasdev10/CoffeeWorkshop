import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IUserState } from './user.state';

/**
 * Feature selector
 */
export const selectUserState = createFeatureSelector<IUserState>('user');

/**
 * Selectors básicos
 */
export const selectUsers = createSelector(selectUserState, (state) => state.users);

export const selectSelectedUser = createSelector(selectUserState, (state) => state.selectedUser);

export const selectFilters = createSelector(selectUserState, (state) => state.filters);

export const selectLoading = createSelector(selectUserState, (state) => state.loading);

export const selectError = createSelector(selectUserState, (state) => state.error);

/**
 * Selectors derivados
 */
export const selectIsLoading = createSelector(selectLoading, (loading) => loading === 'loading');

export const selectHasError = createSelector(selectError, (error) => error !== null);

/**
 * Selector: Usuários filtrados
 */
export const selectFilteredUsers = createSelector(selectUsers, selectFilters, (users, filters) => {
  return users.filter((user) => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesName = user.fullName.toLowerCase().includes(searchLower);
      const matchesEmail = user.email.toLowerCase().includes(searchLower);
      if (!matchesName && !matchesEmail) {
        return false;
      }
    }

    return true;
  });
});

/**
 * Selector: Contagem de usuários
 */
export const selectUserCount = createSelector(selectUsers, (users) => users.length);

/**
 * Selector: Contagem de usuários filtrados
 */
export const selectFilteredUserCount = createSelector(selectFilteredUsers, (users) => users.length);
