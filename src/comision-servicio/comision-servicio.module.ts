import { forwardRef, Module } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { ComisionServicioController } from './comision-servicio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Servicio, servicioSchema } from 'src/servicio/schema/servicio.schema';
import { ComisionServicio, comisionServicioSchema } from './schema/comision-servicio.schema';
import { ServicioModule } from 'src/servicio/servicio.module';

@Module({
    imports:[
          MongooseModule.forFeature([
            {
              name:ComisionServicio.name, schema:comisionServicioSchema
            },
          
          ]),
          ServicioModule
          
        ],
  controllers: [ComisionServicioController],
  providers: [ComisionServicioService],
  exports: [ComisionServicioService],
})
export class ComisionServicioModule {}
