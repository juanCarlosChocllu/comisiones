import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port, rutaFrontEnd } from './core/config/config';
import * as bodyParser from 'body-parser';
import { LoggerInterceptor } from './core/interceptors/logger.interceptor';
import { LogService } from './log/log.service';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [rutaFrontEnd],
    methods: 'GET,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });
  app.use(
    bodyParser.json({ limit: '2mb' }),
    bodyParser.urlencoded({ limit: '2mb', extended: true }),
  );
  app.set('trust proxy', true);
  const logService = app.get(LogService);
  app.useGlobalInterceptors(new LoggerInterceptor(logService));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory(errors) {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : [];
        
          return {
            propiedad: error.property,
            errors: constraints.length > 0 ?constraints.length :error.children,
          };
        });
        
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Errores de validación',
          errors: formattedErrors,
        });
      },
    }),
  );
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('Comiciones')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, documentFactory);
  await app.listen(port, () => {
    console.log('Servidor corriendo en el', port);
  });
}
bootstrap();
