import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  console.log(process.env['ENVIRONMENT']);
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('ResumeBoost API')
    .setDescription('ResumeBoost internal API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8080);
}

bootstrap();
