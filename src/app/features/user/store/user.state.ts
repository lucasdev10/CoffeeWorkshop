import { ILoadingState } from '@app/shared';
import { IUser, IUserFilters } from '../models/user.model';

/**
 * Estado da feature de usuários
 */
export interface IUserState {
  users: IUser[];
  selectedUser: IUser | null;
  filters: IUserFilters;
  loading: ILoadingState;
  error: string | null;
}

/**
 * Estado inicial
 */
export const initialUserState: IUserState = {
  users: [],
  selectedUser: null,
  filters: {},
  loading: 'idle',
  error: null,
};
