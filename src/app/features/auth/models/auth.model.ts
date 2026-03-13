import { IUser } from '@app/features/user/models/user.model';
import { LoadingState } from '@app/shared';

/**
 * Credenciais de login
 */
export interface ILoginCredentials {
  email: string;
  password: string;
}

/**
 * Resposta de autenticação
 */
export interface IAuthResponse {
  user: IUser;
  token: string;
  refreshToken?: string;
}

/**
 * Interface da store de autenticação
 */
export interface IAuthStoreState {
  user: IUser | null;
  token: string | null;
  loading: LoadingState;
  error: string | null;
}
