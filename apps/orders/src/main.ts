import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from 'libs/interceptors/ApiResponse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ApiResponse());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
