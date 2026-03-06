import { TestBed } from '@angular/core/testing';
import { Utils } from '@app/shared/utils/utils';
import moment from 'moment';
import { delay, of, throwError } from 'rxjs';
import { EUserRole, IUser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { UserStore } from './user.store';

describe('UserStore', () => {
  let service: UserStore;
  let repository: UserRepository;

  let users: IUser[] = [
    {
      id: Utils.generateId(),
      email: 'admin@admin.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: EUserRole.ADMIN,
      createdAt: moment('2026-01-01').unix(),
      updatedAt: moment('2026-01-01').unix(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStore);
    repository = TestBed.inject(UserRepository);

    vi.spyOn(repository, 'findAll').mockReturnValue(of(users));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loadUsers correctly and update states', () => {
    service.loadUsers();

    expect(service.users()).toEqual(users);
    expect(service.hasError()).toBe(false);
  });

  it('should call loadUsers with error and update states', () => {
    vi.spyOn(repository, 'findAll').mockReturnValue(throwError(() => 'Failed to load users'));

    service.loadUsers();

    expect(service.users()).toEqual([]);
    expect(service.hasError()).toBe(true);
    expect(service.error()).toBe('Failed to load users');
  });

  it('should verify loading update status after loadUsers', async () => {
    vi.spyOn(repository, 'findAll').mockReturnValue(of(users).pipe(delay(500)));

    service.loadUsers();

    expect(service.isLoading()).toBe(true);

    await vi.waitFor(() => {
      expect(service.isLoading()).toBe(false);
    });
  });
});
