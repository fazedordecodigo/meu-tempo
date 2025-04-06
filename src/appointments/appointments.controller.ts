import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Request,
  Query,
  ParseUUIDPipe
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AvailableSlotsDto } from './dto/available-slots.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentStatus } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(req.user.id, createAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.appointmentsService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('upcoming')
  findUpcoming(@Request() req) {
    return this.appointmentsService.findUpcoming(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('range')
  findByDateRange(
    @Request() req,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return this.appointmentsService.findByDateRange(req.user.id, startDate, endDate);
  }

  @UseGuards(JwtAuthGuard)
  @Get('available-slots')
  getAvailableSlots(
    @Request() req,
    @Query() availableSlotsDto: AvailableSlotsDto,
  ) {
    return this.appointmentsService.getAvailableSlots(req.user.id, availableSlotsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.appointmentsService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @Request() req,
  ) {
    return this.appointmentsService.update(id, req.user.id, updateAppointmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: AppointmentStatus,
    @Request() req,
  ) {
    return this.appointmentsService.updateStatus(id, req.user.id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.appointmentsService.remove(id, req.user.id);
  }

  // Endpoint público para criação de agendamentos
  @Post('public/:providerId')
  createPublicAppointment(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Body() createAppointmentDto: CreateAppointmentDto,
  ) {
    return this.appointmentsService.create(providerId, createAppointmentDto);
  }

  // Endpoint público para obter horários disponíveis
  @Get('public/:providerId/available-slots')
  getPublicAvailableSlots(
    @Param('providerId', ParseUUIDPipe) providerId: string,
    @Query() availableSlotsDto: AvailableSlotsDto,
  ) {
    return this.appointmentsService.getAvailableSlots(providerId, availableSlotsDto);
  }
} 