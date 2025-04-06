import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Erros de autorização (401)
      if (error.status === 401) {
        // Realiza o logout sem depender do AuthService
        if (isPlatformBrowser(platformId)) {
          localStorage.removeItem('token');
        }
        router.navigate(['/auth/login']);
        notificationService.showError('Sua sessão expirou. Por favor, faça login novamente.');
      }

      // Erros de permissão (403)
      else if (error.status === 403) {
        notificationService.showError('Você não tem permissão para acessar este recurso.');
      }

      // Outros erros da API
      else if (error.error?.message) {
        notificationService.showError(error.error.message);
      }

      // Erro genérico
      else {
        notificationService.showError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      }

      return throwError(() => error);
    })
  );
};
