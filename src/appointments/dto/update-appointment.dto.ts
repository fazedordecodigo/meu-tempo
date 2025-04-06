import { IsString, IsEmail, IsOptional, IsISO8601, IsUUID, ValidateIf, IsPhoneNumber, IsEnum } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsISO8601()
  startTime?: string;

  @IsOptional()
  @IsUUID()
  serviceId?: string;

  @IsOptional()
  @IsString()
  clientName?: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @ValidateIf(o => o.clientPhone !== undefined)
  @IsPhoneNumber("BR", { message: 'Número de telefone inválido' })
  clientPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  customFields?: Record<string, any>;
} 