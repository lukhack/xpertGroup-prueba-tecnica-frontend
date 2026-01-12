import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '@environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '@shared/interfaces/auth.interface';
import { User } from '@shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  // Signal for reactive authentication state
  currentUser = signal<User | null>(this.getUserFromStorage());
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Register a new user
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/users/register`, data);
  }

  /**
   * Login user and store authentication data
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/users/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data.token) {
            this.setToken(response.data.token);
          }
          const user = new User(
            response.data.user.id,
            response.data.user.name,
            response.data.user.email
          );
          this.setUser(user);
          this.currentUser.set(user);
          this.isAuthenticated.set(true);
        })
      );
  }

  /**
   * Logout user and clear stored data
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  /**
   * Get stored authentication token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has valid token
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Get current user from storage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        return new User(userData.id, userData.name, userData.email);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Store authentication token
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Store user data
   */
  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}
