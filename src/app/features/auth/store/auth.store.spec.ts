import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StorageService } from '@app/core/storage/storage';
import { EUserRole } from '@app/features/user/models/user.model';
import moment from 'moment';
import { of, throwError } from 'rxjs';
import type { Mocked } from 'vitest';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  let store: AuthStore;
  let mockRepository: Mocked<AuthRepository>;
  let mockStorage: Mocked<StorageService>;
  let mockRouter: Mocked<Router>;

  beforeEach(() => {
    // Criar mocks
    mockRepository = {
      login: vi.fn(),
      logout: vi.fn(),
      validateToken: vi.fn(),
      refreshToken: vi.fn(),
    } as any;

    mockStorage = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      has: vi.fn(),
      keys: vi.fn(),
    } as any;

    mockRouter = {
      navigate: vi.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthStore,
        { provide: AuthRepository, useValue: mockRepository },
        { provide: StorageService, useValue: mockStorage },
        { provide: Router, useValue: mockRouter },
      ],
    });

    store = TestBed.inject(AuthStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and redirect admin to /admin', async () => {
      const mockResponse = {
        user: {
          id: '1',
          email: 'admin@test.com',
          password: 'hashed-password',
          fullName: 'Admin User',
          role: EUserRole.ADMIN,
          createdAt: moment().unix(),
          updatedAt: moment().unix(),
        },
        token: 'mock-token',
      };

      mockRepository.login.mockReturnValue(of(mockResponse));

      store.login({ email: 'admin@test.com', password: 'password' });

      await vi.waitFor(() => {
        expect(store.isAuthenticated()).toBe(true);
        expect(store.isAdmin()).toBe(true);
        expect(store.user()?.email).toBe('admin@test.com');
        expect(mockStorage.set).toHaveBeenCalledWith('auth_token', 'mock-token');
        expect(mockStorage.set).toHaveBeenCalledWith('auth_user', mockResponse.user);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
      });
    });

    it('should login successfully and redirect user to /products', async () => {
      const mockResponse = {
        user: {
          id: '2',
          email: 'user@test.com',
          password: 'hashed-password',
          fullName: 'Regular User',
          role: EUserRole.USER,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        token: 'mock-token',
      };

      mockRepository.login.mockReturnValue(of(mockResponse));

      store.login({ email: 'user@test.com', password: 'password' });

      await vi.waitFor(() => {
        expect(store.isAuthenticated()).toBe(true);
        expect(store.isAdmin()).toBe(false);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/products']);
      });
    });

    it('should handle login error', async () => {
      mockRepository.login.mockReturnValue(throwError(() => ({ message: 'Invalid credentials' })));

      store.login({ email: 'wrong@test.com', password: 'wrong' });

      await vi.waitFor(() => {
        expect(store.error()).toBe('Invalid credentials');
        expect(store.isAuthenticated()).toBe(false);
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockRepository.logout.mockReturnValue(of(void 0));

      store.logout();

      await vi.waitFor(() => {
        expect(store.isAuthenticated()).toBe(false);
        expect(store.user()).toBeNull();
        expect(mockStorage.remove).toHaveBeenCalledWith('auth_token');
        expect(mockStorage.remove).toHaveBeenCalledWith('auth_user');
        expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
      });
    });
  });

  describe('computed signals', () => {
    it('should return correct isAuthenticated value', () => {
      expect(store.isAuthenticated()).toBe(false);
    });

    it('should return correct isAdmin value', () => {
      expect(store.isAdmin()).toBe(false);
    });
  });
});
