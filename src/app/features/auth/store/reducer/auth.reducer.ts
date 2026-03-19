import { createReducer, on } from '@ngrx/store';
import { AuthActions } from '../auth.actions';
import { initialAuthState } from '../auth.state';

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: 'loading',
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { auth }) => ({
    ...state,
    ...auth,
    loading: 'success',
  })),
  on(AuthActions.loginError, (state, { error }) => ({
    ...state,
    loading: 'error',
    error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: 'loading',
    error: null,
  })),
  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    loading: 'success',
    error: null,
    user: null,
    token: null,
  })),
  on(AuthActions.logoutError, (state) => ({
    ...state,
    loading: 'error',
    error: null,
    user: null,
    token: null,
  })),
  on(AuthActions.setAuthentication, (state, { token, user }) => ({
    ...state,
    token,
    user,
  })),
);
