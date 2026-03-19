import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '@app/core/storage/storage';
import { EUserRole } from '@app/features/user/models/user.model';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { AuthRepository } from '../../repositories/auth.repository';
import { AuthActions } from '../auth.actions';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly repository = inject(AuthRepository);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.repository.login(credentials).pipe(
          map((auth) => {
            this.storage.set('auth_token', auth.token);
            this.storage.set('auth_user', auth.user);

            if (auth.user.role === EUserRole.ADMIN) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/products']);
            }
            return AuthActions.loginSuccess({ auth });
          }),
          catchError((error) =>
            of(
              AuthActions.loginError({
                error: error.message || 'Failed to login',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() =>
        this.repository.logout().pipe(
          map(() => {
            this.clearAuth();
            return AuthActions.logoutSuccess();
          }),
          catchError(() => {
            this.clearAuth();
            return of(AuthActions.logoutError());
          }),
        ),
      ),
    ),
  );

  private clearAuth(): void {
    this.storage.remove('auth_token');
    this.storage.remove('auth_user');
    this.router.navigate(['/auth/login']);
  }
}
