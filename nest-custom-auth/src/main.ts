import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

import configuration from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = configuration().port;

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const openApiConfig = new DocumentBuilder().setTitle('Custom Auth').build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, openApiConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(port);
}

bootstrap();
