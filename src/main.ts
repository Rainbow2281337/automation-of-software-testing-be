import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Automation of software testing API')
    .setDescription('Automation of software testing API description')
    .setVersion('1.0')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, swaggerDoc);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
