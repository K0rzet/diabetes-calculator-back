import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS и кодировки
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Установка заголовков для правильной кодировки
  app.use((req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  // Глобальная валидация
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Глобальный фильтр исключений
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Diabetes Calculator API')
    .setDescription('API for diabetes insulin calculator')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4200);
}
bootstrap();
