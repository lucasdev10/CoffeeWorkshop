/**
 * Modelo de usuário
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Roles/Permissões do usuário
 */
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
  Manager = 'MANAGER',
  Guest = 'GUEST',
}

/**
 * DTO para login
 */
export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * DTO para registro
 */
export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

/**
 * Resposta de autenticação
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}
