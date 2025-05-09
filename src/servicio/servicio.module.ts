import { forwardRef, Module } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { ServicioController } from './servicio.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Servicio, servicioSchema } from './schema/servicio.schema';
import { PreciosModule } from 'src/precios/precios.module';
import { ComisionServicioModule } from 'src/comision-servicio/comision-servicio.module';

@Module({
   imports:[
        MongooseModule.forFeature([
          {
            name:Servicio.name, schema:servicioSchema
          },
    
        ]),
        PreciosModule,
        forwardRef(()=> ComisionServicioModule)
    
      ],
  controllers: [ServicioController],
  providers: [ServicioService],
  exports:[ServicioService]
})
export class ServicioModule {}
