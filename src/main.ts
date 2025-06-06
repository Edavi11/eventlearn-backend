import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseStatusInterceptor } from './common/interceptors/api-response/api-response.interceptor';
import { ApiExceptionFilter } from './common/filters/api_exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    allowedHeaders: 'Content-Type, Authorization', 
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true,
  }));

  app.useGlobalInterceptors(new ResponseStatusInterceptor());

  app.useGlobalFilters(new ApiExceptionFilter());

  await app.listen(3000);
}
bootstrap();
