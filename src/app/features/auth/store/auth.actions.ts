import { IUser } from '@app/features/user/models/user.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { IAuthResponse, ILoginCredentials } from '../models/auth.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ credentials: ILoginCredentials }>(),
    'Login Success': props<{ auth: IAuthResponse }>(),
    'Login Error': props<{ error: string }>(),
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Error': emptyProps(),
    'Set Authentication': props<{ token: string; user: IUser }>(),
  },
});
