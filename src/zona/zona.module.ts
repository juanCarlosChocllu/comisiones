import { Module } from '@nestjs/common';
import { ZonaService } from './zona.service';
import { ZonaController } from './zona.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Zona, zonaSchema } from './schema/zona.schema';
import { sucursaSchema } from 'src/sucursal/schema/sucursal.schema';
import { SucursalModule } from 'src/sucursal/sucursal.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Zona.name,
        schema: zonaSchema,
      },
    ]),
    SucursalModule
  ],
  controllers: [ZonaController],
  providers: [ZonaService],
})
export class ZonaModule {}
