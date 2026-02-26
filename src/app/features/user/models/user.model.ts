/**
 * Modelo de usuário
 */
export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: IUserRole;
}

/**
 * Roles de usuário
 */
export enum IUserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
