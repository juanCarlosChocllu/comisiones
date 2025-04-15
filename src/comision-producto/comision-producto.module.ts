import { Module } from '@nestjs/common';
import { ComisionProductoService } from './comision-producto.service';
import { ComisionProductoController } from './comision-producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComisionProducto, comisionProductoSchema } from './schema/comision-producto.schema';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:ComisionProducto.name, schema:comisionProductoSchema
        }
      ])
    ],
  controllers: [ComisionProductoController],
  providers: [ComisionProductoService],
})
export class ComisionProductoModule {}
