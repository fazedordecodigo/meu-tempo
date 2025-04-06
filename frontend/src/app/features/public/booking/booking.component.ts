import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

import { AppointmentsService } from '../../../core/services/appointments.service';
import { ServicesService } from '../../../core/services/services.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    TranslateModule
  ],
  template: `
    <div class="booking-container">
      <div class="header-container" *ngIf="provider">
        <mat-card class="provider-info">
          <mat-card-header>
            <div mat-card-avatar class="provider-avatar">{{ getProviderInitials() }}</div>
            <mat-card-title>{{ provider.businessName || provider.name }}</mat-card-title>
            <mat-card-subtitle>{{ provider.profession }}</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>

      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="50"></mat-spinner>
        <p class="loading-text">{{ 'BOOKING.LOADING' | translate }}</p>
      </div>

      <div class="error-container" *ngIf="errorMessage">
        <p class="error-message">{{ errorMessage }}</p>
        <button mat-raised-button color="primary" routerLink="/">{{ 'BOOKING.BACK_HOME' | translate }}</button>
      </div>

      <div class="booking-stepper-container" *ngIf="!isLoading && !errorMessage">
        <h1 class="booking-title">{{ 'BOOKING.TITLE' | translate }}</h1>

        <mat-stepper [linear]="true" #stepper>
          <!-- Step 1: Select Service -->
          <mat-step [stepControl]="serviceForm">
            <form [formGroup]="serviceForm">
              <ng-template matStepLabel>{{ 'BOOKING.STEP_SERVICE' | translate }}</ng-template>

              <div class="step-content">
                <p class="step-description">{{ 'BOOKING.SERVICE_DESCRIPTION' | translate }}</p>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.SELECT_SERVICE' | translate }}</mat-label>
                  <mat-select formControlName="serviceId" required>
                    <mat-option *ngFor="let service of services" [value]="service.id">
                      {{ service.name }} ({{ service.duration }} min - {{ service.price | currency:'BRL' }})
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="serviceForm.get('serviceId')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-raised-button color="primary" matStepperNext [disabled]="serviceForm.invalid">
                  {{ 'BOOKING.NEXT' | translate }}
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 2: Select Date and Time -->
          <mat-step [stepControl]="dateTimeForm">
            <form [formGroup]="dateTimeForm">
              <ng-template matStepLabel>{{ 'BOOKING.STEP_DATETIME' | translate }}</ng-template>

              <div class="step-content">
                <p class="step-description">{{ 'BOOKING.DATETIME_DESCRIPTION' | translate }}</p>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.SELECT_DATE' | translate }}</mat-label>
                  <input matInput [matDatepicker]="picker" formControlName="date" required>
                  <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="dateTimeForm.get('date')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>

                <div class="time-slots">
                  <h3>{{ 'BOOKING.AVAILABLE_TIMES' | translate }}</h3>
                  <div class="slots-container">
                    <button
                      *ngFor="let slot of availableSlots"
                      mat-raised-button
                      [color]="dateTimeForm.get('time')?.value === slot.value ? 'primary' : ''"
                      (click)="selectTimeSlot(slot.value)">
                      {{ slot.label }}
                    </button>
                    <p *ngIf="availableSlots.length === 0" class="no-slots">
                      {{ 'BOOKING.NO_AVAILABLE_SLOTS' | translate }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>{{ 'BOOKING.BACK' | translate }}</button>
                <button mat-raised-button color="primary" matStepperNext [disabled]="dateTimeForm.invalid">
                  {{ 'BOOKING.NEXT' | translate }}
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 3: Client Info -->
          <mat-step [stepControl]="clientForm">
            <form [formGroup]="clientForm">
              <ng-template matStepLabel>{{ 'BOOKING.STEP_CLIENT' | translate }}</ng-template>

              <div class="step-content">
                <p class="step-description">{{ 'BOOKING.CLIENT_DESCRIPTION' | translate }}</p>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.CLIENT_NAME' | translate }}</mat-label>
                  <input matInput formControlName="name" required>
                  <mat-error *ngIf="clientForm.get('name')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.CLIENT_EMAIL' | translate }}</mat-label>
                  <input matInput formControlName="email" type="email" required>
                  <mat-error *ngIf="clientForm.get('email')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                  <mat-error *ngIf="clientForm.get('email')?.hasError('email')">
                    {{ 'VALIDATION.INVALID_EMAIL' | translate }}
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.CLIENT_PHONE' | translate }}</mat-label>
                  <input matInput formControlName="phone">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>{{ 'BOOKING.NOTES' | translate }}</mat-label>
                  <textarea matInput formControlName="notes" rows="3"></textarea>
                </mat-form-field>
              </div>

              <div class="step-actions">
                <button mat-button matStepperPrevious>{{ 'BOOKING.BACK' | translate }}</button>
                <button mat-raised-button color="primary" matStepperNext [disabled]="clientForm.invalid">
                  {{ 'BOOKING.NEXT' | translate }}
                </button>
              </div>
            </form>
          </mat-step>

          <!-- Step 4: Confirmation -->
          <mat-step>
            <ng-template matStepLabel>{{ 'BOOKING.STEP_CONFIRMATION' | translate }}</ng-template>

            <div class="step-content">
              <h2>{{ 'BOOKING.REVIEW_APPOINTMENT' | translate }}</h2>

              <div class="confirmation-details">
                <mat-card>
                  <mat-card-content>
                    <p><strong>{{ 'BOOKING.SERVICE' | translate }}:</strong> {{ getSelectedServiceName() }}</p>
                    <p><strong>{{ 'BOOKING.DATE' | translate }}:</strong> {{ getFormattedDate() }}</p>
                    <p><strong>{{ 'BOOKING.TIME' | translate }}:</strong> {{ getFormattedTime() }}</p>
                    <p><strong>{{ 'BOOKING.CLIENT_NAME' | translate }}:</strong> {{ clientForm.get('name')?.value }}</p>
                    <p><strong>{{ 'BOOKING.CLIENT_EMAIL' | translate }}:</strong> {{ clientForm.get('email')?.value }}</p>
                    <p *ngIf="clientForm.get('phone')?.value"><strong>{{ 'BOOKING.CLIENT_PHONE' | translate }}:</strong> {{ clientForm.get('phone')?.value }}</p>
                    <p *ngIf="clientForm.get('notes')?.value"><strong>{{ 'BOOKING.NOTES' | translate }}:</strong> {{ clientForm.get('notes')?.value }}</p>
                  </mat-card-content>
                </mat-card>
              </div>
            </div>

            <div class="step-actions">
              <button mat-button matStepperPrevious>{{ 'BOOKING.BACK' | translate }}</button>
              <button mat-raised-button color="primary" (click)="submitBooking()" [disabled]="isSubmitting">
                {{ 'BOOKING.CONFIRM' | translate }}
                <mat-spinner *ngIf="isSubmitting" diameter="20" class="button-spinner"></mat-spinner>
              </button>
            </div>
          </mat-step>

          <!-- Step 5: Success -->
          <mat-step>
            <ng-template matStepLabel>{{ 'BOOKING.STEP_SUCCESS' | translate }}</ng-template>

            <div class="step-content success-content">
              <div class="success-icon">✓</div>
              <h2>{{ 'BOOKING.SUCCESS_TITLE' | translate }}</h2>
              <p>{{ 'BOOKING.SUCCESS_MESSAGE' | translate }}</p>
              <p>{{ 'BOOKING.CHECK_EMAIL' | translate }}</p>
            </div>

            <div class="step-actions">
              <button mat-raised-button color="primary" routerLink="/">
                {{ 'BOOKING.BACK_HOME' | translate }}
              </button>
            </div>
          </mat-step>
        </mat-stepper>
      </div>
    </div>
  `,
  styles: [`
    .booking-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 24px;
    }

    .header-container {
      margin-bottom: 24px;
    }

    .provider-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #3f51b5;
      color: white;
      font-size: 20px;
      font-weight: bold;
    }

    .booking-title {
      text-align: center;
      margin-bottom: 24px;
    }

    .full-width {
      width: 100%;
    }

    .step-content {
      margin: 24px 0;
    }

    .step-description {
      margin-bottom: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    .time-slots {
      margin-top: 16px;
    }

    .slots-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .no-slots {
      grid-column: 1 / -1;
      color: rgba(0, 0, 0, 0.6);
      font-style: italic;
    }

    .confirmation-details {
      margin-top: 16px;
    }

    .success-content {
      text-align: center;
      padding: 24px 0;
    }

    .success-icon {
      font-size: 64px;
      color: #4caf50;
      margin-bottom: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
    }

    .loading-text {
      margin-top: 16px;
      color: rgba(0, 0, 0, 0.6);
    }

    .error-container {
      text-align: center;
      padding: 48px 0;
    }

    .error-message {
      color: #f44336;
      margin-bottom: 24px;
    }

    .button-spinner {
      display: inline-block;
      margin-left: 8px;
    }
  `]
})
export class BookingComponent implements OnInit {
  serviceForm!: FormGroup;
  dateTimeForm!: FormGroup;
  clientForm!: FormGroup;

  customUrl: string = '';
  provider: any = null;
  services: any[] = [];
  availableSlots: { value: string, label: string }[] = [];
  selectedService: any = null;

  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private servicesService: ServicesService,
    private appointmentsService: AppointmentsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.route.params.subscribe(params => {
      this.customUrl = params['customUrl'];
      this.loadProviderData();
    });

    // Watch for date changes to load available time slots
    this.dateTimeForm.get('date')?.valueChanges.subscribe(date => {
      if (date) {
        this.loadAvailableTimeSlots(date);
      }
    });
  }

  initForms(): void {
    this.serviceForm = this.fb.group({
      serviceId: ['', Validators.required]
    });

    this.dateTimeForm = this.fb.group({
      date: [new Date(), Validators.required],
      time: ['', Validators.required]
    });

    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      notes: ['']
    });
  }

  loadProviderData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getPublicProfile(this.customUrl)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (provider) => {
          if (provider) {
            this.provider = provider;
            this.loadServices();
          } else {
            this.errorMessage = 'BOOKING.PROVIDER_NOT_FOUND';
          }
        },
        error: (error) => {
          console.error('Erro ao carregar dados do provedor', error);
          this.errorMessage = 'BOOKING.ERROR_LOADING_PROVIDER';
        }
      });
  }

  loadServices(): void {
    this.servicesService.getServicesByProvider(this.provider.id)
      .subscribe({
        next: (services) => {
          this.services = services.filter((service: any) => service.active);
          if (this.services.length === 0) {
            this.errorMessage = 'BOOKING.NO_SERVICES_AVAILABLE';
          }
        },
        error: (error) => {
          console.error('Erro ao carregar serviços', error);
          this.errorMessage = 'BOOKING.ERROR_LOADING_SERVICES';
        }
      });
  }

  loadAvailableTimeSlots(date: Date): void {
    // For now, use dummy data
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

    // In a real app, you would call the service to get the available slots
    /*
    const formattedDate = date.toISOString().split('T')[0];
    this.appointmentsService.getAvailableSlots(this.provider.id, formattedDate)
      .subscribe({
        next: (slots) => {
          this.availableSlots = slots;
        },
        error: (error) => {
          console.error('Erro ao carregar horários disponíveis', error);
          this.snackBar.open('ERRORS.DEFAULT', 'GENERAL.CLOSE', { duration: 3000 });
        }
      });
    */
  }

  selectTimeSlot(time: string): void {
    this.dateTimeForm.patchValue({ time });
  }

  getProviderInitials(): string {
    if (!this.provider) return '';
    const name = this.provider.name || this.provider.businessName || '';
    return name
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getSelectedServiceName(): string {
    const serviceId = this.serviceForm.get('serviceId')?.value;
    const service = this.services.find(s => s.id === serviceId);
    return service ? service.name : '';
  }

  getFormattedDate(): string {
    const date = this.dateTimeForm.get('date')?.value;
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getFormattedTime(): string {
    return this.dateTimeForm.get('time')?.value || '';
  }

  submitBooking(): void {
    if (this.serviceForm.invalid || this.dateTimeForm.invalid || this.clientForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const serviceId = this.serviceForm.get('serviceId')?.value;
    const date = this.dateTimeForm.get('date')?.value;
    const time = this.dateTimeForm.get('time')?.value;
    const [hours, minutes] = time.split(':');

    const appointmentDate = new Date(date);
    appointmentDate.setHours(Number(hours), Number(minutes), 0);

    const appointmentData = {
      providerId: this.provider.id,
      serviceId: serviceId,
      date: appointmentDate.toISOString(),
      clientName: this.clientForm.get('name')?.value,
      clientEmail: this.clientForm.get('email')?.value,
      clientPhone: this.clientForm.get('phone')?.value,
      notes: this.clientForm.get('notes')?.value,
      status: 'pending'
    };

    this.appointmentsService.createAppointment(appointmentData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          // Navigate to success step
          const stepper = document.querySelector('mat-stepper') as any;
          if (stepper) {
            stepper.next();
          }
        },
        error: (error) => {
          console.error('Erro ao criar agendamento', error);
          this.snackBar.open('BOOKING.ERROR_CREATING_APPOINTMENT', 'GENERAL.CLOSE', { duration: 3000 });
        }
      });
  }
}
