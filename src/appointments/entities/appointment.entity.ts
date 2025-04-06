import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Service } from '../../services/entities/service.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
}

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ 
    type: 'enum', 
    enum: AppointmentStatus, 
    default: AppointmentStatus.SCHEDULED 
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  clientName: string;

  @Column({ nullable: true })
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @ManyToOne(() => Service, service => service.appointments)
  service: Service;

  @ManyToOne(() => User, user => user.providedAppointments)
  provider: User;

  @Column({ type: 'jsonb', nullable: true })
  customFields: any;

  @Column({ nullable: true })
  reminderSent: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 