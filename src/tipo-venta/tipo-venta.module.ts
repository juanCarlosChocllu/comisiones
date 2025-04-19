import { Module } from '@nestjs/common';
import { TipoVentaService } from './tipo-venta.service';
import { TipoVentaController } from './tipo-venta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoVenta, tipoVentaSchema } from './schema/tipo-venta.schema';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:TipoVenta.name, schema:tipoVentaSchema
        }
      ])
    ],
  controllers: [TipoVentaController],
  providers: [TipoVentaService],
  exports: [TipoVentaService]
})
export class TipoVentaModule {}
