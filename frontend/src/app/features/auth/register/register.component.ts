import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="register-container">
      <h2>Criar Conta</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name">Nome</label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Seu nome completo"
          >
          <div class="error" *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched">
            Nome é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            formControlName="email"
            placeholder="Seu email"
          >
          <div class="error" *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched">
            Email inválido
          </div>
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            type="password"
            id="password"
            formControlName="password"
            placeholder="Sua senha"
          >
          <div class="error" *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched">
            Senha deve ter pelo menos 6 caracteres
          </div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            id="confirmPassword"
            formControlName="confirmPassword"
            placeholder="Confirme sua senha"
          >
          <div class="error" *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.touched">
            As senhas não coincidem
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" [disabled]="registerForm.invalid">Registrar</button>
        </div>

        <div class="login-link">
          <p>Já tem uma conta? <a routerLink="/auth/login">Faça login</a></p>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .register-container {
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

    .login-link {
      text-align: center;
      margin-top: 20px;
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: any) {
    const password = formGroup.get('password').value;
    const confirmPassword = formGroup.get('confirmPassword').value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        name: this.registerForm.value.name || '',
        email: this.registerForm.value.email || '',
        password: this.registerForm.value.password || '',
        role: 'user' as const
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Erro no registro:', error);
        }
      });
    }
  }
}
