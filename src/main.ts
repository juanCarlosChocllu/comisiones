import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port, rutaFrontEnd } from './core/config/config';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: rutaFrontEnd,
    methods: 'GET,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });
  app.use(
    bodyParser.json({ limit: '2mb' }),
    bodyParser.urlencoded({ limit: '2mb', extended: true }),
  );

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
            errors: constraints,
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
