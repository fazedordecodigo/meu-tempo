import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="reset-password-container">
      <h2>Redefinir Senha</h2>

      <div *ngIf="submitted" class="success-message">
        <p>Sua senha foi redefinida com sucesso.</p>
        <a routerLink="/auth/login" class="login-link">Ir para login</a>
      </div>

      <div *ngIf="error" class="error-message">
        <p>{{ errorMessage }}</p>
        <a routerLink="/auth/forgot-password" class="retry-link">Solicitar nova recuperação</a>
      </div>

      <form *ngIf="!submitted && !error" [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="password">Nova Senha</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Sua nova senha"
          >
          <div class="error" *ngIf="resetPasswordForm.get('password')?.invalid && resetPasswordForm.get('password')?.touched">
            Senha deve ter pelo menos 6 caracteres
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            formControlName="confirmPassword"
            placeholder="Confirme sua nova senha"
          >
          <div class="error" *ngIf="resetPasswordForm.hasError('passwordMismatch') && resetPasswordForm.get('confirmPassword')?.touched">
            As senhas não coincidem
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="resetPasswordForm.invalid">Redefinir Senha</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .reset-password-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      margin-bottom: 20px;
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

    .success-message, .error-message {
      text-align: center;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }

    .success-message {
      background-color: #d4edda;
      color: #155724;
    }

    .error-message {
      background-color: #f8d7da;
      color: #721c24;
    }

    .login-link, .retry-link {
      display: block;
      margin-top: 15px;
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  token: string = '';
  submitted = false;
  error = false;
  errorMessage = 'Token inválido ou expirado. Por favor, solicite uma nova recuperação de senha.';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Inicializar o formulário
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Recuperar o token da URL
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];

      if (!this.token) {
        this.error = true;
      }
    });
  }

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token) {
      this.authService.resetPassword(
        this.token,
        this.resetPasswordForm.value.password || ''
      ).subscribe({
        next: () => {
          this.submitted = true;
        },
        error: (error) => {
          console.error('Erro ao redefinir senha:', error);
          this.error = true;
        }
      });
    }
  }
}
