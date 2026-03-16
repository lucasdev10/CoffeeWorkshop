import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ICreateUserDto, IUpdateUserDto, IUser, IUserFilters } from '../models/user.model';

/**
 * Actions da feature de usuários
 * Seguindo o padrão de nomenclatura do NgRx
 */
export const UserActions = createActionGroup({
  source: 'User',
  events: {
    // Load Users
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: IUser[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Load User By Id
    'Load User By Id': props<{ id: string }>(),
    'Load User By Id Success': props<{ user: IUser }>(),
    'Load User By Id Failure': props<{ error: string }>(),

    // Create User
    'Create User': props<{ dto: ICreateUserDto }>(),
    'Create User Success': props<{ user: IUser }>(),
    'Create User Failure': props<{ error: string }>(),

    // Update User
    'Update User': props<{ id: string; dto: IUpdateUserDto }>(),
    'Update User Success': props<{ user: IUser }>(),
    'Update User Failure': props<{ error: string }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Filters
    'Set Filters': props<{ filters: IUserFilters }>(),
    'Clear Filters': emptyProps(),

    // Error Handling
    'Clear Error': emptyProps(),
  },
});
