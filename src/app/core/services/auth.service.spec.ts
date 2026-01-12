import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { LoginRequest, RegisterRequest } from '@shared/interfaces/auth.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login user and store token and user data', () => {
      const credentials: LoginRequest = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResponse = {
        message: 'Login successful',
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'fake-jwt-token'
      };

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(service.isAuthenticated()).toBe(true);
        expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/users/login');
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear stored data and navigate to login', () => {
      localStorage.setItem('auth_token', 'fake-token');
      localStorage.setItem('current_user', JSON.stringify({ id: '1', name: 'Test', email: 'test@example.com' }));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('current_user')).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'fake-token');
      expect(service.getToken()).toBe('fake-token');
    });

    it('should return null if no token stored', () => {
      expect(service.getToken()).toBeNull();
    });
  });
});
