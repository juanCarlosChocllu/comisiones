import { forwardRef, Module } from '@nestjs/common';
import { ComisionProductoService } from './comision-producto.service';
import { ComisionProductoController } from './comision-producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComisionProducto, comisionProductoSchema } from './schema/comision-producto.schema';
import { ProductoModule } from 'src/producto/producto.module';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:ComisionProducto.name, schema:comisionProductoSchema
        }
      ]),
      forwardRef(()=> ProductoModule)
    ],
  controllers: [ComisionProductoController],
  providers: [ComisionProductoService],
  exports: [ComisionProductoService],
})
export class ComisionProductoModule {}
