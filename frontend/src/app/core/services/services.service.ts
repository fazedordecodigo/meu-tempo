import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private apiUrl = `${environment.apiUrl}/services`;

  constructor(private http: HttpClient) {}

  getServices(params: any = {}): Observable<any> {
    return this.http.get(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Erro ao buscar serviços', error);
        return of({ data: [], total: 0 });
      })
    );
  }

  getServiceById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar serviço com ID ${id}`, error);
        return of(null);
      })
    );
  }

  createService(serviceData: any): Observable<any> {
    return this.http.post(this.apiUrl, serviceData).pipe(
      catchError(error => {
        console.error('Erro ao criar serviço', error);
        throw error;
      })
    );
  }

  updateService(id: string, serviceData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, serviceData).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar serviço com ID ${id}`, error);
        throw error;
      })
    );
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao excluir serviço com ID ${id}`, error);
        throw error;
      })
    );
  }

  toggleServiceStatus(id: string, active: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { active }).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar status do serviço com ID ${id}`, error);
        throw error;
      })
    );
  }

  getActiveServices(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active`).pipe(
      catchError(error => {
        console.error('Erro ao buscar serviços ativos', error);
        return of([]);
      })
    );
  }

  getServicesByProvider(providerId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/provider/${providerId}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar serviços do provedor ${providerId}`, error);
        return of([]);
      })
    );
  }
} 