import { Module } from '@nestjs/common';
import { RangoComisionProductoService } from './rango-comision-producto.service';
import { RangoComisionProductoController } from './rango-comision-producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RangoComisionProducto, rangoComisionProductoSchema } from './schema/rangoComisionProducto.schema';
import { PreciosModule } from 'src/precios/precios.module';

@Module({
     imports:[
        MongooseModule.forFeature([
          {
            name:RangoComisionProducto.name, schema:rangoComisionProductoSchema
          }
        ]),
        PreciosModule
      ],
  controllers: [RangoComisionProductoController],
  providers: [RangoComisionProductoService],
  exports: [RangoComisionProductoService],
})
export class RangoComisionProductoModule {}
