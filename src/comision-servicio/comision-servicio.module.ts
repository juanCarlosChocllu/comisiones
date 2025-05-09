import { Module } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { ComisionServicioController } from './comision-servicio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Servicio, servicioSchema } from 'src/servicio/schema/servicio.schema';
import { ComisionServicio, comisionServicioSchema } from './schema/comision-servicio.schema';

@Module({
    imports:[
          MongooseModule.forFeature([
            {
              name:ComisionServicio.name, schema:comisionServicioSchema
            },
          
          ])
        ],
  controllers: [ComisionServicioController],
  providers: [ComisionServicioService],
  exports: [ComisionServicioService],
})
export class ComisionServicioModule {}
