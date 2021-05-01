import * as cookieParser from 'cookie-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  // const ENV = process.env['ENVIRONMENT'] || 'DEV';

  // if (ENV == 'TEST') {
  //   process.env['MONGODB'] = process.env['MONGODB_URI_TEST'];
  // } else {
  //   process.env['MONGODB'] = process.env['MONGODB_URI'];
  // }

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.enableCors({
    credentials: true,
    origin: ['http://64.227.7.184:3000', 'http://localhost:3000'],
  });

  const config = new DocumentBuilder()
    .setTitle('ResumeBoost API')
    .setDescription('ResumeBoost internal API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
  // app.setGlobalPrefix('api');
}

bootstrap();
