import { IUser } from '@app/features/user/models/user.model';
import { ILoadingState } from '@app/shared';

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  refreshToken: string | null;
  loading: ILoadingState;
  error: string | null;
}

export const initialAuthState: IAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: 'idle',
  error: null,
};
