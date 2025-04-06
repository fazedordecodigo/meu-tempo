import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { AppointmentsService } from '../../../core/services/appointments.service';
import { ServicesService } from '../../../core/services/services.service';

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{ (appointment ? 'APPOINTMENTS.EDIT' : 'APPOINTMENTS.NEW') | translate }}
    </h2>
    
    <form [formGroup]="appointmentForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.CLIENT_NAME' | translate }}</mat-label>
            <input matInput formControlName="clientName" required>
            <mat-error *ngIf="appointmentForm.get('clientName')?.hasError('required')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.CLIENT_EMAIL' | translate }}</mat-label>
            <input matInput formControlName="clientEmail" type="email" required>
            <mat-error *ngIf="appointmentForm.get('clientEmail')?.hasError('required')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </mat-error>
            <mat-error *ngIf="appointmentForm.get('clientEmail')?.hasError('email')">
              {{ 'VALIDATION.INVALID_EMAIL' | translate }}
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.CLIENT_PHONE' | translate }}</mat-label>
            <input matInput formControlName="clientPhone">
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.SERVICE' | translate }}</mat-label>
            <mat-select formControlName="serviceId" required>
              <mat-option *ngFor="let service of services" [value]="service.id">
                {{ service.name }} ({{ service.duration }} min - {{ service.price | currency:'BRL' }})
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('serviceId')?.hasError('required')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.DATE' | translate }}</mat-label>
            <input matInput [matDatepicker]="datePicker" formControlName="date" required>
            <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
            <mat-datepicker #datePicker></mat-datepicker>
            <mat-error *ngIf="appointmentForm.get('date')?.hasError('required')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.TIME' | translate }}</mat-label>
            <mat-select formControlName="time" required>
              <mat-option *ngFor="let slot of availableSlots" [value]="slot.value">
                {{ slot.label }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="appointmentForm.get('time')?.hasError('required')">
              {{ 'VALIDATION.REQUIRED' | translate }}
            </mat-error>
          </mat-form-field>
        </div>
        
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ 'APPOINTMENTS.NOTES' | translate }}</mat-label>
            <textarea matInput formControlName="notes" rows="3"></textarea>
          </mat-form-field>
        </div>
        
        <div class="form-row" *ngIf="appointment">
          <mat-label>{{ 'APPOINTMENTS.STATUS' | translate }}</mat-label>
          <mat-radio-group formControlName="status" class="status-group">
            <mat-radio-button value="confirmed">{{ 'STATUS.CONFIRMED' | translate }}</mat-radio-button>
            <mat-radio-button value="pending">{{ 'STATUS.PENDING' | translate }}</mat-radio-button>
            <mat-radio-button value="cancelled">{{ 'STATUS.CANCELLED' | translate }}</mat-radio-button>
          </mat-radio-group>
        </div>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>{{ 'GENERAL.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="appointmentForm.invalid">
          {{ 'GENERAL.SAVE' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }
    
    .form-row {
      margin-bottom: 16px;
    }
    
    .status-group {
      display: flex;
      flex-direction: column;
      margin-top: 8px;
    }
    
    .status-group mat-radio-button {
      margin-bottom: 8px;
    }
  `]
})
export class AppointmentFormComponent implements OnInit {
  appointmentForm!: FormGroup;
  appointment: any;
  services: any[] = [];
  availableSlots: { value: string, label: string }[] = [];
  
  constructor(
    private fb: FormBuilder,
    private appointmentsService: AppointmentsService,
    private servicesService: ServicesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<AppointmentFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.appointment = data?.appointment;
  }
  
  ngOnInit(): void {
    this.initForm();
    this.loadServices();
    
    if (this.appointment) {
      const date = new Date(this.appointment.date);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      this.appointmentForm.patchValue({
        clientName: this.appointment.clientName,
        clientEmail: this.appointment.clientEmail,
        clientPhone: this.appointment.clientPhone || '',
        serviceId: this.appointment.serviceId,
        date: date,
        time: `${hours}:${minutes}`,
        notes: this.appointment.notes || '',
        status: this.appointment.status
      });
      
      // Carregar horários disponíveis para a data selecionada
      this.loadAvailableSlots(date);
    }
    
    // Monitorar mudanças na data para atualizar os horários disponíveis
    this.appointmentForm.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailableSlots(date);
      }
    });
  }
  
  initForm(): void {
    this.appointmentForm = this.fb.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: [''],
      serviceId: ['', Validators.required],
      date: [new Date(), Validators.required],
      time: ['', Validators.required],
      notes: [''],
      status: ['pending']
    });
  }
  
  loadServices(): void {
    this.servicesService.getActiveServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => {
        console.error('Erro ao carregar serviços', error);
      }
    });
  }
  
  loadAvailableSlots(date: Date): void {
    // Exemplo de slots disponíveis
    // Na implementação real, você obteria esses slots do backend
    this.availableSlots = [
      { value: '09:00', label: '09:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' },
      { value: '13:00', label: '13:00' },
      { value: '14:00', label: '14:00' },
      { value: '15:00', label: '15:00' },
      { value: '16:00', label: '16:00' },
      { value: '17:00', label: '17:00' }
    ];
    
    // Em um cenário real, você chamaria o serviço para buscar os slots disponíveis
    /*
    const formattedDate = date.toISOString().split('T')[0];
    this.appointmentsService.getAvailableSlots(formattedDate).subscribe({
      next: (slots) => {
        this.availableSlots = slots;
      },
      error: (error) => {
        console.error('Erro ao carregar horários disponíveis', error);
      }
    });
    */
  }
  
  onSubmit(): void {
    if (this.appointmentForm.invalid) return;
    
    const formValues = this.appointmentForm.value;
    const [hours, minutes] = formValues.time.split(':');
    
    const appointmentDate = new Date(formValues.date);
    appointmentDate.setHours(Number(hours), Number(minutes), 0);
    
    const appointmentData = {
      clientName: formValues.clientName,
      clientEmail: formValues.clientEmail,
      clientPhone: formValues.clientPhone,
      serviceId: formValues.serviceId,
      date: appointmentDate.toISOString(),
      notes: formValues.notes,
      status: formValues.status
    };
    
    if (this.appointment) {
      // Editar agendamento existente
      this.appointmentsService.updateAppointment(this.appointment.id, appointmentData)
        .subscribe({
          next: (response) => {
            this.snackBar.open('APPOINTMENTS.UPDATE_SUCCESS', 'GENERAL.CLOSE', { duration: 3000 });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erro ao atualizar agendamento', error);
            this.snackBar.open('ERRORS.DEFAULT', 'GENERAL.CLOSE', { duration: 3000 });
          }
        });
    } else {
      // Criar novo agendamento
      this.appointmentsService.createAppointment(appointmentData)
        .subscribe({
          next: (response) => {
            this.snackBar.open('APPOINTMENTS.CREATE_SUCCESS', 'GENERAL.CLOSE', { duration: 3000 });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erro ao criar agendamento', error);
            this.snackBar.open('ERRORS.DEFAULT', 'GENERAL.CLOSE', { duration: 3000 });
          }
        });
    }
  }
} 