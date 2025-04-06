import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTab,
    MatTabGroup,
    MatSnackBarModule,
    TranslateModule
  ],
  template: `
    <div class="profile-container">
      <h1>{{ 'PROFILE.TITLE' | translate }}</h1>

      <mat-card class="profile-card">
        <mat-tab-group>
          <mat-tab [label]="'PROFILE.PERSONAL_INFO' | translate">
            <form [formGroup]="personalForm" (ngSubmit)="savePersonalInfo()" class="profile-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.NAME' | translate }}</mat-label>
                  <input matInput formControlName="name">
                  <mat-error *ngIf="personalForm.get('name')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.EMAIL' | translate }}</mat-label>
                  <input matInput formControlName="email" type="email">
                  <mat-error *ngIf="personalForm.get('email')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                  <mat-error *ngIf="personalForm.get('email')?.hasError('email')">
                    {{ 'VALIDATION.INVALID_EMAIL' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.PHONE' | translate }}</mat-label>
                  <input matInput formControlName="phone">
                </mat-form-field>
              </div>

              <div class="form-row">
                <button mat-raised-button color="primary" type="submit" [disabled]="personalForm.invalid">
                  {{ 'GENERAL.SAVE' | translate }}
                </button>
              </div>
            </form>
          </mat-tab>

          <mat-tab [label]="'PROFILE.BUSINESS_INFO' | translate">
            <form [formGroup]="businessForm" (ngSubmit)="saveBusinessInfo()" class="profile-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.BUSINESS_NAME' | translate }}</mat-label>
                  <input matInput formControlName="businessName">
                  <mat-error *ngIf="businessForm.get('businessName')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.PROFESSION' | translate }}</mat-label>
                  <input matInput formControlName="profession">
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.CUSTOM_URL' | translate }}</mat-label>
                  <input matInput formControlName="customUrl">
                  <mat-hint>{{ 'PROFILE.CUSTOM_URL_HINT' | translate }}</mat-hint>
                  <mat-error *ngIf="businessForm.get('customUrl')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                  <mat-error *ngIf="businessForm.get('customUrl')?.hasError('pattern')">
                    {{ 'VALIDATION.INVALID_URL' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <button mat-raised-button color="primary" type="submit" [disabled]="businessForm.invalid">
                  {{ 'GENERAL.SAVE' | translate }}
                </button>
              </div>
            </form>
          </mat-tab>

          <mat-tab [label]="'PROFILE.CHANGE_PASSWORD' | translate">
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="profile-form">
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.CURRENT_PASSWORD' | translate }}</mat-label>
                  <input matInput formControlName="currentPassword" type="password">
                  <mat-error *ngIf="passwordForm.get('currentPassword')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.NEW_PASSWORD' | translate }}</mat-label>
                  <input matInput formControlName="newPassword" type="password">
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                  <mat-error *ngIf="passwordForm.get('newPassword')?.hasError('minlength')">
                    {{ 'VALIDATION.PASSWORD_LENGTH' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>{{ 'PROFILE.CONFIRM_PASSWORD' | translate }}</mat-label>
                  <input matInput formControlName="confirmPassword" type="password">
                  <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('required')">
                    {{ 'VALIDATION.REQUIRED' | translate }}
                  </mat-error>
                  <mat-error *ngIf="passwordForm.get('confirmPassword')?.hasError('passwordMismatch')">
                    {{ 'VALIDATION.PASSWORD_MISMATCH' | translate }}
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid">
                  {{ 'GENERAL.SAVE' | translate }}
                </button>
              </div>
            </form>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 16px;
    }

    .profile-card {
      margin-top: 16px;
    }

    .profile-form {
      padding: 24px 16px;
    }

    .form-row {
      margin-bottom: 16px;
      width: 100%;
    }

    mat-form-field {
      width: 100%;
    }
  `]
})
export class ProfileComponent implements OnInit {
  personalForm!: FormGroup;
  businessForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadUserData();
  }

  initForms(): void {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.businessForm = this.fb.group({
      businessName: ['', Validators.required],
      profession: [''],
      customUrl: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  loadUserData(): void {
    // Simular carregamento de dados do usuário
    const userData = {
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      phone: '(11) 98765-4321',
      businessName: 'Consultoria Silva',
      profession: 'Advogado',
      customUrl: 'joao-advogado'
    };

    this.personalForm.patchValue({
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    });

    this.businessForm.patchValue({
      businessName: userData.businessName,
      profession: userData.profession,
      customUrl: userData.customUrl
    });
  }

  savePersonalInfo(): void {
    if (this.personalForm.valid) {
      // Implementar lógica para salvar informações pessoais
      this.snackBar.open('Informações pessoais atualizadas com sucesso!', 'Fechar', {
        duration: 3000
      });
    }
  }

  saveBusinessInfo(): void {
    if (this.businessForm.valid) {
      // Implementar lógica para salvar informações de negócio
      this.snackBar.open('Informações de negócio atualizadas com sucesso!', 'Fechar', {
        duration: 3000
      });
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      // Implementar lógica para alterar senha
      this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
        duration: 3000
      });
      this.passwordForm.reset();
    }
  }
}
