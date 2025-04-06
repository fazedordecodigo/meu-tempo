import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Habilitar CORS para permitir requisições do frontend
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:4200'),
    credentials: true,
  });
  
  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // Prefixo global para todas as rotas da API
  app.setGlobalPrefix('api');
  
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
  
  console.log(`Aplicação rodando na porta ${port}`);
}

bootstrap();
