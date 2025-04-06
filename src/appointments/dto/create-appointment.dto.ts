import { IsNotEmpty, IsString, IsEmail, IsOptional, IsISO8601, IsUUID, ValidateIf, IsPhoneNumber } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsISO8601()
  startTime: string;

  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsString()
  clientName: string;

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string;

  @IsOptional()
  @ValidateIf(o => o.clientPhone !== undefined)
  @IsPhoneNumber("BR", { message: 'Número de telefone inválido' })
  clientPhone?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  customFields?: Record<string, any>;
} 