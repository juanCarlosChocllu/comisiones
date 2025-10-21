import { Module } from '@nestjs/common';
import { PreciosService } from './service/precios.service';
import { PreciosController } from './precios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Precio, PrecioSchema } from './schema/precio.schema';
import { DetallePrecio, DetallePrecioSchema } from './schema/detallePrecio.schema';
import { DetallePrecioSucursal, DetallePrecioSucursalSchema } from './schema/DetallePrecioSucursalSchema';


@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:Precio.name, schema:PrecioSchema
        },
        {
          name:DetallePrecio.name, schema:DetallePrecioSchema
        },
        {
          name:DetallePrecioSucursal.name, schema:DetallePrecioSucursalSchema
        }
      ])
    ],
  controllers: [PreciosController],
  providers: [PreciosService],
  exports: [PreciosService]
})
export class PreciosModule {}
