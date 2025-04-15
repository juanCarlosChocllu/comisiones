import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Venta, ventaSchema } from './schema/venta.schema';

@Module({
    imports:[
      MongooseModule.forFeature([
        {
          name:Venta.name, schema:ventaSchema
        }
      ])
    ],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}
