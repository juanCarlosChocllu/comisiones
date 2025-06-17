import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { port, rutaFrontEnd } from './core/config/config';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const proxy = app.getHttpAdapter().getInstance()
  proxy.set('trust proxy', true);
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
