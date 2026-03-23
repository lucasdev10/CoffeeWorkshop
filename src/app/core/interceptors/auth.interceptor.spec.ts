import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CookieService } from '../cookie/cookie.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let mockRequest: HttpRequest<unknown>;
  let mockNext: HttpHandlerFn;
  let cookieService: CookieService;

  beforeEach(() => {
    mockRequest = new HttpRequest('GET', '/api/test');

    mockNext = vi.fn((req: HttpRequest<unknown>) => of({} as HttpEvent<unknown>));

    cookieService = TestBed.inject(CookieService);

    cookieService.clear();
  });

  afterEach(() => {
    cookieService.clear();
  });

  it('should add Authorization header when token exists', () => {
    // Arrange
    const token = 'test-token-123';
    cookieService.set('auth_token', token);

    // Act
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockNext));

    // Assert
    expect(mockNext).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          lazyUpdate: expect.arrayContaining([
            expect.objectContaining({
              name: 'Authorization',
              value: `Bearer ${token}`,
            }),
          ]),
        }),
      }),
    );
  });

  it('should not add Authorization header when token does not exist', () => {
    // Act
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockNext));

    // Assert
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should pass request to next handler', () => {
    // Act
    const result = TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockNext));

    // Assert
    expect(mockNext).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should clone request when adding token', () => {
    // Arrange
    const token = 'test-token-456';
    cookieService.set('auth_token', token);

    // Act
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockNext));

    // Assert
    const calledRequest = (mockNext as any).mock.calls[0][0];
    expect(calledRequest).not.toBe(mockRequest);
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
  });

  it('should handle empty token string', () => {
    // Arrange
    cookieService.set('auth_token', '');

    // Act
    TestBed.runInInjectionContext(() => authInterceptor(mockRequest, mockNext));

    // Assert
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should work with different HTTP methods', () => {
    // Arrange
    const token = 'test-token-789';
    cookieService.set('auth_token', token);
    const postRequest = new HttpRequest('POST', '/api/test', { data: 'test' });

    // Act
    TestBed.runInInjectionContext(() => authInterceptor(postRequest, mockNext));

    // Assert
    const calledRequest = (mockNext as any).mock.calls[0][0];
    expect(calledRequest.headers.get('Authorization')).toBe(`Bearer ${token}`);
    expect(calledRequest.method).toBe('POST');
  });
});
