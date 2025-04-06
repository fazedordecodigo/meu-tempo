import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  private apiUrl = `${environment.apiUrl}/appointments`;

  constructor(private http: HttpClient) {}

  getAppointments(params: any = {}): Observable<any> {
    return this.http.get(this.apiUrl, { params }).pipe(
      catchError(error => {
        console.error('Erro ao buscar agendamentos', error);
        return of({ data: [], total: 0 });
      })
    );
  }

  getAppointmentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao buscar agendamento com ID ${id}`, error);
        return of(null);
      })
    );
  }

  createAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, appointmentData).pipe(
      catchError(error => {
        console.error('Erro ao criar agendamento', error);
        throw error;
      })
    );
  }

  updateAppointment(id: string, appointmentData: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, appointmentData).pipe(
      catchError(error => {
        console.error(`Erro ao atualizar agendamento com ID ${id}`, error);
        throw error;
      })
    );
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}).pipe(
      catchError(error => {
        console.error(`Erro ao cancelar agendamento com ID ${id}`, error);
        throw error;
      })
    );
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erro ao excluir agendamento com ID ${id}`, error);
        throw error;
      })
    );
  }

  getAvailableSlots(providerId: string, date: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/available-slots`, { 
      params: { providerId, date } 
    }).pipe(
      catchError(error => {
        console.error('Erro ao buscar horários disponíveis', error);
        return of([]);
      })
    );
  }

  getTodayAppointments(): Observable<any> {
    const today = new Date().toISOString().split('T')[0];
    return this.http.get(`${this.apiUrl}/today`).pipe(
      catchError(error => {
        console.error('Erro ao buscar agendamentos de hoje', error);
        return of([]);
      })
    );
  }

  getUpcomingAppointments(limit: number = 5): Observable<any> {
    return this.http.get(`${this.apiUrl}/upcoming`, { 
      params: { limit: limit.toString() } 
    }).pipe(
      catchError(error => {
        console.error('Erro ao buscar próximos agendamentos', error);
        return of([]);
      })
    );
  }
} 