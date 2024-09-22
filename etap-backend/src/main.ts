import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { ValidateInputPipe } from './core/pipes/validate.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  // Set up CORS options
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  };

  // Enable CORS with options
  app.enableCors(corsOptions);
 
  // Setting up the swagger doc
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Etap Documentations')
    .setDescription('This is the official API documentation for Etap')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidateInputPipe());
  await app.listen(9000);
}
bootstrap();
