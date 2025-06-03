import { forwardRef, Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Producto, productoSchema } from './schema/producto.schema';
import { ColorModule } from 'src/color/color.module';
import { MarcaModule } from 'src/marca/marca.module';
import { TipoMontura } from 'src/tipo-montura/schema/tipo-montura.schema';
import { TipoMonturaModule } from 'src/tipo-montura/tipo-montura.module';
import { PreciosService } from 'src/precios/service/precios.service';
import { PreciosModule } from 'src/precios/precios.module';
import { ComisionProductoModule } from 'src/comision-producto/comision-producto.module';
import { ComisionProducto, comisionProductoSchema } from 'src/comision-producto/schema/comision-producto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Producto.name, schema: productoSchema },
       { name: ComisionProducto.name, schema: comisionProductoSchema },
    ]),
    ColorModule,
    MarcaModule,
    TipoMonturaModule,
    PreciosModule,
    forwardRef(()=> ComisionProductoModule)
  ],
  controllers: [ProductoController],
  providers: [ProductoService],
  exports: [ProductoService],
})
export class ProductoModule {}
