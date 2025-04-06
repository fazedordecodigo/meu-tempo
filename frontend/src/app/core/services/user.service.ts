import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private currentUser: any = null;

  constructor(private http: HttpClient) {}

  getCurrentUser(): Observable<any> {
    if (this.currentUser) {
      return of(this.currentUser);
    }

    return this.http.get(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUser = user),
      catchError(error => {
        console.error('Erro ao buscar usuário atual', error);
        return of(null);
      })
    );
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/profile`, userData).pipe(
      tap(updatedUser => {
        this.currentUser = { ...this.currentUser, ...updatedUser };
      }),
      catchError(error => {
        console.error('Erro ao atualizar perfil', error);
        throw error;
      })
    );
  }

  updateBusinessInfo(businessData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/business`, businessData).pipe(
      tap(updatedBusiness => {
        this.currentUser = { 
          ...this.currentUser, 
          business: { 
            ...this.currentUser.business, 
            ...updatedBusiness 
          } 
        };
      }),
      catchError(error => {
        console.error('Erro ao atualizar informações de negócio', error);
        throw error;
      })
    );
  }

  changePassword(passwordData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, passwordData).pipe(
      catchError(error => {
        console.error('Erro ao alterar senha', error);
        throw error;
      })
    );
  }

  checkCustomUrlAvailability(customUrl: string): Observable<boolean> {
    return this.http.get<{ available: boolean }>(`${this.apiUrl}/check-url/${customUrl}`).pipe(
      map(response => response.available),
      catchError(error => {
        console.error('Erro ao verificar disponibilidade da URL', error);
        return of(false);
      })
    );
  }

  getPublicProfile(customUrl: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/public/${customUrl}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar perfil público para ${customUrl}`, error);
        return of(null);
      })
    );
  }

  // Método para limpar o cache do usuário atual após o logout
  clearCurrentUser(): void {
    this.currentUser = null;
  }
} 