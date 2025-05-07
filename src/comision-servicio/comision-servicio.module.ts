import { Module } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { ComisionServicioController } from './comision-servicio.controller';

@Module({
  controllers: [ComisionServicioController],
  providers: [ComisionServicioService],
})
export class ComisionServicioModule {}
