import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="forgot-password-container">
      <h2>Recuperar Senha</h2>
      <p class="instructions">Digite seu email e enviaremos um link para recuperar sua senha.</p>

      <div *ngIf="submitted" class="success-message">
        <p>Se o email existir em nosso sistema, você receberá instruções para recuperar sua senha em breve.</p>
        <a routerLink="/auth/login" class="back-link">Voltar para login</a>
      </div>

      <form *ngIf="!submitted" [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Seu email"
          >
          <div class="error" *ngIf="forgotPasswordForm.get('email')?.invalid && forgotPasswordForm.get('email')?.touched">
            Email inválido
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="forgotPasswordForm.invalid">Enviar link</button>
        </div>

        <div class="login-link">
          <p><a routerLink="/auth/login">Voltar para login</a></p>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 10px;
    }

    .instructions {
      text-align: center;
      margin-bottom: 20px;
      color: #666;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .error {
      color: red;
      font-size: 12px;
      margin-top: 5px;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }

    button {
      padding: 10px 15px;
      background-color: #0275d8;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      width: 100%;
    }

    button:disabled {
      background-color: #cccccc;
    }

    a {
      color: #0275d8;
      text-decoration: none;
    }

    .login-link {
      text-align: center;
      margin-top: 20px;
    }

    .success-message {
      text-align: center;
      margin: 20px 0;
    }

    .back-link {
      display: block;
      margin-top: 15px;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value.email || '').subscribe({
        next: () => {
          this.submitted = true;
        },
        error: (error) => {
          console.error('Erro ao recuperar senha:', error);
          // Mesmo com erro, mostramos mensagem de sucesso por segurança
          this.submitted = true;
        }
      });
    }
  }
}
