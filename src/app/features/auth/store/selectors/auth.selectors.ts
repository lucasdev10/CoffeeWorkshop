import { EUserRole } from '@app/features/user/models/user.model';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IAuthState } from '../auth.state';

export const selectInitialAuthState = createFeatureSelector<IAuthState>('auth');

export const selectUser = createSelector(selectInitialAuthState, (state) => state.user);

export const selectIsLoading = createSelector(
  selectInitialAuthState,
  (state) => state.loading === 'loading',
);

export const selectError = createSelector(selectInitialAuthState, (state) => state.error);

export const selectIsAdmin = createSelector(
  selectInitialAuthState,
  (state) => state.user?.role === EUserRole.ADMIN,
);

export const selectIsAuthenticated = createSelector(
  selectInitialAuthState,
  (state) => !!state.user && !!state.token,
);

export const selectToken = createSelector(selectInitialAuthState, (state) => state.token);
