import { Component, OnInit, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

import { ServicesService } from '../../../core/services/services.service';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    TranslateModule
  ],
  template: `
    <h2 mat-dialog-title>
      {{ (service ? 'SERVICES.EDIT' : 'SERVICES.NEW') | translate }}
    </h2>
    
    <form [formGroup]="serviceForm" (ngSubmit)="onSubmit()">
      <div mat-dialog-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'SERVICES.NAME' | translate }}</mat-label>
          <input matInput formControlName="name" required>
          <mat-error *ngIf="serviceForm.get('name')?.hasError('required')">
            {{ 'VALIDATION.REQUIRED' | translate }}
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'SERVICES.DURATION' | translate }}</mat-label>
          <input matInput type="number" formControlName="duration" required>
          <mat-error *ngIf="serviceForm.get('duration')?.hasError('required')">
            {{ 'VALIDATION.REQUIRED' | translate }}
          </mat-error>
          <mat-error *ngIf="serviceForm.get('duration')?.hasError('min')">
            {{ 'VALIDATION.MIN_DURATION' | translate }}
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'SERVICES.PRICE' | translate }}</mat-label>
          <input matInput type="number" formControlName="price" required>
          <mat-error *ngIf="serviceForm.get('price')?.hasError('required')">
            {{ 'VALIDATION.REQUIRED' | translate }}
          </mat-error>
          <mat-error *ngIf="serviceForm.get('price')?.hasError('min')">
            {{ 'VALIDATION.MIN_PRICE' | translate }}
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>{{ 'SERVICES.DESCRIPTION' | translate }}</mat-label>
          <textarea matInput formControlName="description" rows="4"></textarea>
        </mat-form-field>
        
        <div class="active-toggle">
          <mat-slide-toggle formControlName="active" color="primary">
            {{ 'SERVICES.ACTIVE' | translate }}
          </mat-slide-toggle>
        </div>
      </div>
      
      <div mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>{{ 'GENERAL.CANCEL' | translate }}</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="serviceForm.invalid">
          {{ 'GENERAL.SAVE' | translate }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .active-toggle {
      margin-bottom: 16px;
    }
  `]
})
export class ServiceFormComponent implements OnInit {
  serviceForm!: FormGroup;
  service: any;
  
  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ServiceFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.service = data?.service;
  }
  
  ngOnInit(): void {
    this.initForm();
    
    if (this.service) {
      this.serviceForm.patchValue({
        name: this.service.name,
        duration: this.service.duration,
        price: this.service.price,
        description: this.service.description || '',
        active: this.service.active
      });
    }
  }
  
  initForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      duration: [30, [Validators.required, Validators.min(5)]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      active: [true]
    });
  }
  
  onSubmit(): void {
    if (this.serviceForm.invalid) return;
    
    const serviceData = this.serviceForm.value;
    
    if (this.service) {
      // Editar serviço existente
      this.servicesService.updateService(this.service.id, serviceData)
        .subscribe({
          next: (response) => {
            this.snackBar.open('SERVICES.UPDATE_SUCCESS', 'GENERAL.CLOSE', { duration: 3000 });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erro ao atualizar serviço', error);
            this.snackBar.open('ERRORS.DEFAULT', 'GENERAL.CLOSE', { duration: 3000 });
          }
        });
    } else {
      // Criar novo serviço
      this.servicesService.createService(serviceData)
        .subscribe({
          next: (response) => {
            this.snackBar.open('SERVICES.CREATE_SUCCESS', 'GENERAL.CLOSE', { duration: 3000 });
            this.dialogRef.close(response);
          },
          error: (error) => {
            console.error('Erro ao criar serviço', error);
            this.snackBar.open('ERRORS.DEFAULT', 'GENERAL.CLOSE', { duration: 3000 });
          }
        });
    }
  }
} 