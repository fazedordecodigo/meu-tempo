import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards,
  Request
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(req.user.id, createServiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req) {
    return this.servicesService.findAll(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('active')
  findActive(@Request() req) {
    return this.servicesService.findUserActiveServices(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.servicesService.findOne(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req
  ) {
    return this.servicesService.update(id, req.user.id, updateServiceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.servicesService.remove(id, req.user.id);
  }

  // Rota pública para obter serviços ativos de um usuário por customUrl
  @Get('provider/:customUrl')
  findProviderServices(@Param('customUrl') customUrl: string) {
    // Esta rota será implementada posteriormente
    // Vai precisar do UsersService para encontrar um usuário pela URL personalizada
    // e depois obter seus serviços ativos
  }
} 