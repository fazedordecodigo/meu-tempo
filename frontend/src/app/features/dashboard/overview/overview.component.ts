import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    RouterModule
  ],
  template: `
    <div class="overview-container">
      <h1>{{ 'DASHBOARD.WELCOME' | translate }}</h1>
      
      <div class="stats-container">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>event</mat-icon>
            <mat-card-title>{{ 'DASHBOARD.TODAY_APPOINTMENTS' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content class="stat-content">
            <span class="stat-value">5</span>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/dashboard/appointments">{{ 'DASHBOARD.VIEW_ALL' | translate }}</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>calendar_today</mat-icon>
            <mat-card-title>{{ 'DASHBOARD.WEEK_APPOINTMENTS' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content class="stat-content">
            <span class="stat-value">12</span>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/dashboard/appointments">{{ 'DASHBOARD.VIEW_ALL' | translate }}</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-icon mat-card-avatar>build</mat-icon>
            <mat-card-title>{{ 'DASHBOARD.SERVICES' | translate }}</mat-card-title>
          </mat-card-header>
          <mat-card-content class="stat-content">
            <span class="stat-value">8</span>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button routerLink="/dashboard/services">{{ 'DASHBOARD.MANAGE' | translate }}</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-card class="upcoming-appointments">
        <mat-card-header>
          <mat-card-title>{{ 'DASHBOARD.UPCOMING_APPOINTMENTS' | translate }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p *ngIf="!upcomingAppointments.length">{{ 'DASHBOARD.NO_UPCOMING_APPOINTMENTS' | translate }}</p>
          <div *ngFor="let appointment of upcomingAppointments" class="appointment-item">
            <div class="appointment-date">
              <span class="date">{{ appointment.date | date:'dd/MM' }}</span>
              <span class="time">{{ appointment.date | date:'HH:mm' }}</span>
            </div>
            <div class="appointment-details">
              <div class="client-name">{{ appointment.clientName }}</div>
              <div class="service-name">{{ appointment.serviceName }}</div>
            </div>
            <div class="appointment-status" [ngClass]="appointment.status">
              {{ 'STATUS.' + appointment.status.toUpperCase() | translate }}
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button routerLink="/dashboard/appointments">{{ 'DASHBOARD.VIEW_ALL' | translate }}</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .overview-container {
      padding: 16px;
    }
    
    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .stat-card {
      margin-bottom: 16px;
    }
    
    .stat-content {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100px;
    }
    
    .stat-value {
      font-size: 48px;
      font-weight: bold;
    }
    
    .upcoming-appointments {
      margin-bottom: 24px;
    }
    
    .appointment-item {
      display: flex;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .appointment-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 60px;
      margin-right: 16px;
    }
    
    .date {
      font-weight: bold;
    }
    
    .appointment-details {
      flex: 1;
    }
    
    .client-name {
      font-weight: bold;
    }
    
    .appointment-status {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      text-transform: uppercase;
    }
    
    .confirmed {
      background-color: #e6f7ed;
      color: #0e6027;
    }
    
    .pending {
      background-color: #fff8e6;
      color: #805b10;
    }
    
    .cancelled {
      background-color: #fbe9e7;
      color: #c62828;
    }
  `]
})
export class OverviewComponent implements OnInit {
  upcomingAppointments = [
    {
      id: 1,
      clientName: 'João Silva',
      serviceName: 'Consulta Jurídica',
      date: new Date('2023-09-15T14:00:00'),
      status: 'confirmed'
    },
    {
      id: 2,
      clientName: 'Maria Oliveira',
      serviceName: 'Atendimento Nutricional',
      date: new Date('2023-09-16T10:30:00'),
      status: 'pending'
    },
    {
      id: 3,
      clientName: 'Pedro Santos',
      serviceName: 'Consulta Psicológica',
      date: new Date('2023-09-17T09:00:00'),
      status: 'cancelled'
    }
  ];

  constructor() {}

  ngOnInit(): void {}
} 