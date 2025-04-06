import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    private usersService: UsersService,
  ) {}

  async create(userId: string, createServiceDto: CreateServiceDto): Promise<Service> {
    const user = await this.usersService.findOne(userId);
    
    // Verifica o plano de assinatura e limita o número de serviços
    const userServices = await this.servicesRepository.count({ where: { user: { id: userId } } });
    
    if (user.subscriptionPlan === 'free' && userServices >= 1) {
      throw new ForbiddenException('O plano gratuito permite apenas 1 serviço. Faça upgrade para adicionar mais.');
    } else if (user.subscriptionPlan === 'basic' && userServices >= 5) {
      throw new ForbiddenException('O plano básico permite até 5 serviços. Faça upgrade para adicionar mais.');
    }
    
    const service = this.servicesRepository.create({
      ...createServiceDto,
      user,
    });

    return this.servicesRepository.save(service);
  }

  async findAll(userId: string): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { user: { id: userId } },
      order: { name: 'ASC' },
    });
  }

  async findUserActiveServices(userId: string): Promise<Service[]> {
    return this.servicesRepository.find({
      where: { 
        user: { id: userId },
        isActive: true
      },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!service) {
      throw new NotFoundException(`Serviço com ID ${id} não encontrado`);
    }

    return service;
  }

  async update(id: string, userId: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id, userId);
    
    Object.assign(service, updateServiceDto);
    
    return this.servicesRepository.save(service);
  }

  async remove(id: string, userId: string): Promise<void> {
    const service = await this.findOne(id, userId);
    await this.servicesRepository.remove(service);
  }
} 