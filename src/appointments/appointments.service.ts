import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { addMinutes, format, parse, startOfDay, endOfDay, setHours, setMinutes, isAfter, isBefore, areIntervalsOverlapping } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AvailableSlotsDto } from './dto/available-slots.dto';
import { UsersService } from '../users/users.service';
import { ServicesService } from '../services/services.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private usersService: UsersService,
    private servicesService: ServicesService,
  ) {}

  async create(providerId: string, createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const provider = await this.usersService.findOne(providerId);
    const service = await this.servicesService.findOne(createAppointmentDto.serviceId, providerId);

    const startTime = new Date(createAppointmentDto.startTime);
    const endTime = addMinutes(startTime, service.duration);

    // Verificar se o horário está disponível
    const isAvailable = await this.isTimeSlotAvailable(
      providerId,
      startTime,
      endTime,
    );

    if (!isAvailable) {
      throw new BadRequestException('O horário selecionado não está disponível');
    }

    // Verificar se o usuário ultrapassou o limite de agendamentos (plano gratuito)
    if (provider.subscriptionPlan === 'free') {
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date();
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      monthEnd.setDate(0); // Último dia do mês
      monthEnd.setHours(23, 59, 59, 999);
      
      const appointmentsThisMonth = await this.appointmentsRepository.count({
        where: {
          provider: { id: providerId },
          createdAt: Between(monthStart, monthEnd),
        },
      });
      
      if (appointmentsThisMonth >= 10) {
        throw new ForbiddenException(
          'Você atingiu o limite de 10 agendamentos no plano gratuito. Faça upgrade para adicionar mais.',
        );
      }
    }

    const appointment = this.appointmentsRepository.create({
      startTime,
      endTime,
      clientName: createAppointmentDto.clientName,
      clientEmail: createAppointmentDto.clientEmail,
      clientPhone: createAppointmentDto.clientPhone,
      notes: createAppointmentDto.notes,
      customFields: createAppointmentDto.customFields,
      provider,
      service,
      status: AppointmentStatus.SCHEDULED,
    });

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(providerId: string): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: { 
        provider: { id: providerId } 
      },
      relations: ['service'],
      order: { startTime: 'DESC' },
    });
  }

  async findUpcoming(providerId: string): Promise<Appointment[]> {
    const now = new Date();
    
    return this.appointmentsRepository.find({
      where: { 
        provider: { id: providerId },
        startTime: MoreThanOrEqual(now),
        status: AppointmentStatus.SCHEDULED
      },
      relations: ['service'],
      order: { startTime: 'ASC' },
    });
  }

  async findByDateRange(providerId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      where: {
        provider: { id: providerId },
        startTime: Between(startOfDay(startDate), endOfDay(endDate)),
      },
      relations: ['service'],
      order: { startTime: 'ASC' },
    });
  }

  async findOne(id: string, providerId: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { 
        id, 
        provider: { id: providerId } 
      },
      relations: ['service'],
    });

    if (!appointment) {
      throw new NotFoundException(`Agendamento com ID ${id} não encontrado`);
    }

    return appointment;
  }

  async update(id: string, providerId: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id, providerId);
    
    let startTime = appointment.startTime;
    let endTime = appointment.endTime;
    let service = appointment.service;
    
    // Se o horário de início ou o serviço foi alterado, recalcular o horário final
    if (updateAppointmentDto.startTime || updateAppointmentDto.serviceId) {
      if (updateAppointmentDto.serviceId) {
        service = await this.servicesService.findOne(updateAppointmentDto.serviceId, providerId);
      }
      
      if (updateAppointmentDto.startTime) {
        startTime = new Date(updateAppointmentDto.startTime);
      }
      
      endTime = addMinutes(startTime, service.duration);
      
      // Verificar se o novo horário está disponível (ignorando o agendamento atual)
      const isAvailable = await this.isTimeSlotAvailable(
        providerId,
        startTime,
        endTime,
        id,
      );
      
      if (!isAvailable) {
        throw new BadRequestException('O horário selecionado não está disponível');
      }
    }
    
    // Atualizar os campos do agendamento
    Object.assign(appointment, {
      ...updateAppointmentDto,
      startTime,
      endTime,
      service,
    });
    
    return this.appointmentsRepository.save(appointment);
  }

  async updateStatus(id: string, providerId: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await this.findOne(id, providerId);
    
    appointment.status = status;
    
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: string, providerId: string): Promise<void> {
    const appointment = await this.findOne(id, providerId);
    await this.appointmentsRepository.remove(appointment);
  }

  async getAvailableSlots(providerId: string, availableSlotsDto: AvailableSlotsDto): Promise<Date[]> {
    const { serviceId, date } = availableSlotsDto;
    
    const provider = await this.usersService.findOne(providerId);
    const service = await this.servicesService.findOne(serviceId, providerId);

    const requestedDate = parse(date, 'yyyy-MM-dd', new Date());
    
    // Horário de trabalho padrão (8h às 18h) com intervalo de 1 hora para almoço
    // Em um sistema real, isso viria das configurações do usuário
    const workHoursStart = 8; // 8:00 AM
    const workHoursEnd = 18; // 6:00 PM
    const lunchBreakStart = 12; // 12:00 PM
    const lunchBreakEnd = 13; // 1:00 PM
    
    // Reservar slots de acordo com a duração do serviço (arredondar para 15 minutos)
    const slotDurationMinutes = Math.ceil(service.duration / 15) * 15;
    
    // Obter todos os agendamentos para esta data
    const dayStart = startOfDay(requestedDate);
    const dayEnd = endOfDay(requestedDate);
    
    const existingAppointments = await this.appointmentsRepository.find({
      where: {
        provider: { id: providerId },
        startTime: Between(dayStart, dayEnd),
        status: AppointmentStatus.SCHEDULED,
      },
    });
    
    // Gerar todos os possíveis slots
    const availableSlots: Date[] = [];
    
    for (let hour = workHoursStart; hour < workHoursEnd; hour++) {
      // Pular horário de almoço
      if (hour >= lunchBreakStart && hour < lunchBreakEnd) {
        continue;
      }
      
      for (let minute = 0; minute < 60; minute += 15) {
        const slotStart = setMinutes(setHours(requestedDate, hour), minute);
        const slotEnd = addMinutes(slotStart, slotDurationMinutes);
        
        // Verificar se o slot termina dentro do horário de trabalho e não invade o horário de almoço
        const lunchStart = setMinutes(setHours(requestedDate, lunchBreakStart), 0);
        const lunchEnd = setMinutes(setHours(requestedDate, lunchBreakEnd), 0);
        
        if (isAfter(slotEnd, setHours(requestedDate, workHoursEnd)) ||
            areIntervalsOverlapping(
              { start: slotStart, end: slotEnd },
              { start: lunchStart, end: lunchEnd }
            )) {
          continue;
        }
        
        // Verificar se o slot não conflita com agendamentos existentes
        const isAvailable = existingAppointments.every(appointment => {
          return !areIntervalsOverlapping(
            { start: slotStart, end: slotEnd },
            { start: appointment.startTime, end: appointment.endTime }
          );
        });
        
        if (isAvailable) {
          availableSlots.push(slotStart);
        }
      }
    }
    
    return availableSlots;
  }

  private async isTimeSlotAvailable(
    providerId: string,
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const query = this.appointmentsRepository
      .createQueryBuilder('appointment')
      .where('appointment.provider.id = :providerId', { providerId })
      .andWhere('appointment.status = :status', { status: AppointmentStatus.SCHEDULED })
      .andWhere(
        '(appointment.startTime < :endTime AND appointment.endTime > :startTime)',
        { startTime, endTime }
      );
    
    if (excludeAppointmentId) {
      query.andWhere('appointment.id != :id', { id: excludeAppointmentId });
    }
    
    const conflictingAppointment = await query.getOne();
    
    return !conflictingAppointment;
  }
} 