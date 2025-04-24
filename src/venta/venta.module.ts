import { Module } from '@nestjs/common';
import { VentaService } from './services/venta.service';
import { VentaController } from './venta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DetalleVenta, detalleVentaSchema, Venta, ventaSchema } from './schema/venta.schema';
import { DetalleVentaService } from './services/detallleVenta.service';
import { AsesorModule } from 'src/asesor/asesor.module';
import { CombinacionRecetaModule } from 'src/combinacion-receta/combinacion-receta.module';
import { ComisionReceta } from 'src/comision-receta/schema/comision-receta.schema';
import { ComisionRecetaModule } from 'src/comision-receta/comision-receta.module';
import { ProductoModule } from 'src/producto/producto.module';
import { ComisionProductoModule } from 'src/comision-producto/comision-producto.module';
import { MetasProductoVipModule } from 'src/metas-producto-vip/metas-producto-vip.module';
import { PreciosModule } from 'src/precios/precios.module';

@Module({
    imports:[
      MongooseModule.forFeature([
        {
          name:Venta.name, schema:ventaSchema
        },
        {
          name:DetalleVenta.name, schema:detalleVentaSchema
        }
      ]),
      AsesorModule,
      CombinacionRecetaModule,
      ComisionRecetaModule,
      ProductoModule,
      ComisionProductoModule,
      MetasProductoVipModule,
      PreciosModule
    ],
  controllers: [VentaController],
  providers: [VentaService, DetalleVentaService],
  exports:[VentaService, DetalleVentaService]
})
export class VentaModule {}
