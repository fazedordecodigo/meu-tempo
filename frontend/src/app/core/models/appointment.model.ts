import { Service } from './service.model';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

export interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  service: Service;
  customFields?: Record<string, any>;
  reminderSent?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  startTime: string;
  serviceId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  customFields?: Record<string, any>;
}

export interface UpdateAppointmentRequest {
  startTime?: string;
  serviceId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  notes?: string;
  status?: AppointmentStatus;
  customFields?: Record<string, any>;
}

export interface AvailableSlotRequest {
  serviceId: string;
  date: string;
} 