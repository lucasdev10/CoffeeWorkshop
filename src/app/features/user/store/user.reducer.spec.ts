import { EUserRole, IUser } from '../models/user.model';
import { UserActions } from './user.actions';
import { userReducer } from './user.reducer';
import { initialUserState, IUserState } from './user.state';

describe('UserReducer', () => {
  const mockUsers: IUser[] = [
    {
      id: 'user-id-1',
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: EUserRole.USER,
      createdAt: 1773667531,
      updatedAt: 1773667531,
    },
    {
      id: 'user-id-2',
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password456',
      role: EUserRole.ADMIN,
      createdAt: 1773667531,
      updatedAt: 1773667531,
    },
  ];

  describe('unknown action', () => {
    it('should return the default state', () => {
      const action = { type: 'Unknown' };
      const state = userReducer(initialUserState, action);

      expect(state).toBe(initialUserState);
    });
  });

  describe('Load Users', () => {
    it('should set loading state on loadUsers', () => {
      const action = UserActions.loadUsers();
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should set users on loadUsersSuccess', () => {
      const action = UserActions.loadUsersSuccess({ users: mockUsers });
      const state = userReducer(initialUserState, action);

      expect(state.users).toEqual(mockUsers);
      expect(state.loading).toBe('success');
      expect(state.error).toBeNull();
    });

    it('should set error on loadUsersFailure', () => {
      const error = 'Failed to load users';
      const action = UserActions.loadUsersFailure({ error });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Load User By Id', () => {
    it('should set loading state on loadUserById', () => {
      const action = UserActions.loadUserById({ id: 'test-id' });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should set selected user on loadUserByIdSuccess', () => {
      const action = UserActions.loadUserByIdSuccess({ user: mockUsers[0] });
      const state = userReducer(initialUserState, action);

      expect(state.selectedUser).toEqual(mockUsers[0]);
      expect(state.loading).toBe('success');
      expect(state.error).toBeNull();
    });

    it('should set error on loadUserByIdFailure', () => {
      const error = 'User not found';
      const action = UserActions.loadUserByIdFailure({ error });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Create User', () => {
    it('should set loading state on createUser', () => {
      const dto = {
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password',
        role: EUserRole.USER,
      };
      const action = UserActions.createUser({ dto });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should add user on createUserSuccess', () => {
      const newUser: IUser = {
        id: 'new-id',
        fullName: 'New User',
        email: 'new@example.com',
        password: 'password',
        role: EUserRole.USER,
        createdAt: 1773667531,
        updatedAt: 1773667531,
      };

      const stateWithUsers: IUserState = {
        ...initialUserState,
        users: mockUsers,
      };

      const action = UserActions.createUserSuccess({ user: newUser });
      const state = userReducer(stateWithUsers, action);

      expect(state.users.length).toBe(3);
      expect(state.users).toContain(newUser);
      expect(state.loading).toBe('success');
      expect(state.error).toBeNull();
    });

    it('should set error on createUserFailure', () => {
      const error = 'Failed to create user';
      const action = UserActions.createUserFailure({ error });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Update User', () => {
    it('should set loading state on updateUser', () => {
      const action = UserActions.updateUser({ id: 'test-id', dto: { fullName: 'Updated' } });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should update user on updateUserSuccess', () => {
      const updatedUser = { ...mockUsers[0], fullName: 'Updated Name' };
      const stateWithUsers: IUserState = {
        ...initialUserState,
        users: mockUsers,
      };

      const action = UserActions.updateUserSuccess({ user: updatedUser });
      const state = userReducer(stateWithUsers, action);

      const user = state.users.find((u) => u.id === mockUsers[0].id);
      expect(user?.fullName).toBe('Updated Name');
      expect(state.loading).toBe('success');
      expect(state.error).toBeNull();
    });

    it('should update selected user if it matches', () => {
      const updatedUser = { ...mockUsers[0], fullName: 'Updated Selected' };
      const stateWithSelection: IUserState = {
        ...initialUserState,
        users: mockUsers,
        selectedUser: mockUsers[0],
      };

      const action = UserActions.updateUserSuccess({ user: updatedUser });
      const state = userReducer(stateWithSelection, action);

      expect(state.selectedUser?.fullName).toBe('Updated Selected');
    });

    it('should set error on updateUserFailure', () => {
      const error = 'Failed to update user';
      const action = UserActions.updateUserFailure({ error });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Delete User', () => {
    it('should set loading state on deleteUser', () => {
      const action = UserActions.deleteUser({ id: 'test-id' });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('should remove user on deleteUserSuccess', () => {
      const stateWithUsers: IUserState = {
        ...initialUserState,
        users: mockUsers,
      };

      const action = UserActions.deleteUserSuccess({ id: mockUsers[0].id });
      const state = userReducer(stateWithUsers, action);

      expect(state.users.length).toBe(1);
      expect(state.users.find((u) => u.id === mockUsers[0].id)).toBeUndefined();
      expect(state.loading).toBe('success');
      expect(state.error).toBeNull();
    });

    it('should clear selected user if it matches deleted user', () => {
      const stateWithSelection: IUserState = {
        ...initialUserState,
        users: mockUsers,
        selectedUser: mockUsers[0],
      };

      const action = UserActions.deleteUserSuccess({ id: mockUsers[0].id });
      const state = userReducer(stateWithSelection, action);

      expect(state.selectedUser).toBeNull();
    });

    it('should set error on deleteUserFailure', () => {
      const error = 'Failed to delete user';
      const action = UserActions.deleteUserFailure({ error });
      const state = userReducer(initialUserState, action);

      expect(state.loading).toBe('error');
      expect(state.error).toBe(error);
    });
  });

  describe('Filters', () => {
    it('should set filters on setFilters', () => {
      const filters = { search: 'john' };
      const action = UserActions.setFilters({ filters });
      const state = userReducer(initialUserState, action);

      expect(state.filters).toEqual(filters);
    });

    it('should merge filters on setFilters', () => {
      const stateWithFilters: IUserState = {
        ...initialUserState,
        filters: { search: 'old' },
      };

      const filters = { search: 'new' };
      const action = UserActions.setFilters({ filters });
      const state = userReducer(stateWithFilters, action);

      expect(state.filters.search).toBe('new');
    });

    it('should clear filters on clearFilters', () => {
      const stateWithFilters: IUserState = {
        ...initialUserState,
        filters: { search: 'test' },
      };

      const action = UserActions.clearFilters();
      const state = userReducer(stateWithFilters, action);

      expect(state.filters).toEqual({});
    });
  });

  describe('Error Handling', () => {
    it('should clear error on clearError', () => {
      const stateWithError: IUserState = {
        ...initialUserState,
        error: 'Test error',
      };

      const action = UserActions.clearError();
      const state = userReducer(stateWithError, action);

      expect(state.error).toBeNull();
    });
  });
});
