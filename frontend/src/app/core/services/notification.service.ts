import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface Notification {
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notification$ = this.notificationSubject.asObservable();

  constructor() {}

  show(notification: Notification): void {
    this.notificationSubject.next({
      duration: 5000, // Default duration
      ...notification
    });
  }

  showSuccess(message: string, duration?: number): void {
    this.show({
      type: NotificationType.SUCCESS,
      message,
      duration
    });
  }

  showError(message: string, duration?: number): void {
    this.show({
      type: NotificationType.ERROR,
      message,
      duration
    });
  }

  showInfo(message: string, duration?: number): void {
    this.show({
      type: NotificationType.INFO,
      message,
      duration
    });
  }

  showWarning(message: string, duration?: number): void {
    this.show({
      type: NotificationType.WARNING,
      message,
      duration
    });
  }
} 