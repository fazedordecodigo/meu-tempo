import { IsNotEmpty, IsUUID, IsISO8601, IsOptional } from 'class-validator';

export class AvailableSlotsDto {
  @IsNotEmpty()
  @IsUUID()
  serviceId: string;

  @IsNotEmpty()
  @IsISO8601()
  date: string;

  @IsOptional()
  @IsUUID()
  providerId?: string;
} 