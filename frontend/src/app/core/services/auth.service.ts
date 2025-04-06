import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  accessToken: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'token';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {
    this.loadUserFromLocalStorage();
  }

  private loadUserFromLocalStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        try {
          const user = this.getUserFromToken(token);
          this.currentUserSubject.next(user);
        } catch (error) {
          this.logout();
        }
      }
    }
  }

  private getUserFromToken(token: string): User | null {
    try {
      // Normalmente, você decodificaria o token JWT aqui
      // Para simplificar, apenas simularemos um usuário
      return {
        id: '1',
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        role: 'user'
      };
    } catch (error) {
      return null;
    }
  }

  login(email: string, password: string): Observable<User> {
    // Em um ambiente real, você faria uma chamada HTTP para o backend
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, response.accessToken);
          }
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Erro no login:', error);
          return throwError(() => new Error('Erro nas credenciais'));
        })
      );
  }

  register(userData: Partial<User>): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, response.accessToken);
          }
          this.currentUserSubject.next(response.user);
        }),
        map(response => response.user),
        catchError(error => {
          console.error('Erro no registro:', error);
          return throwError(() => new Error('Erro no registro'));
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
    this.currentUserSubject.next(null);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password });
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(this.tokenKey);
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
