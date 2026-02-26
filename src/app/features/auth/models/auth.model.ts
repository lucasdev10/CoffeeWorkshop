/**
 * Modelo de usuário
 */
export interface IUser {
  id: string;
  email: string;
  name: string;
  role: IUserRole;
  avatar?: string;
}

/**
 * Roles de usuário
 */
export enum IUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

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
