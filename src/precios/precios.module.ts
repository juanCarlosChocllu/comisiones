import { Module } from '@nestjs/common';
import { PreciosService } from './precios.service';
import { PreciosController } from './precios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Precio, PrecioSchema } from './schema/precio.schema';
import { DetallePrecio, DetallePrecioSchema } from './schema/detallePrecio.schema';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:Precio.name, schema:PrecioSchema
        },
        {
          name:DetallePrecio.name, schema:DetallePrecioSchema
        }
      ])
    ],
  controllers: [PreciosController],
  providers: [PreciosService],
  exports: [PreciosService]
})
export class PreciosModule {}
