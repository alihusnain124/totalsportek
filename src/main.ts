import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { HttpStatus } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './utils/exception-filters/globalException.filter';
import { join } from 'path';
import * as express from 'express';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalFilters(new GlobalExceptionFilter());

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Hello from App!. System is healthy state',
    });
  });
  app.use('/public', express.static(join(__dirname, '..', 'public')));
  const config = new DocumentBuilder()
    .setTitle('TotalSportek Documentation')
    .setDescription('TotalSportek API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
