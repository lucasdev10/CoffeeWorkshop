import { IUser } from '@app/features/user/models/user.model';

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
 * Estado de autenticação
 */
export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
