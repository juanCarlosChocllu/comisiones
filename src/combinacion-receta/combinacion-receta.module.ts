import { Module } from '@nestjs/common';
import { CombinacionRecetaService } from './combinacion-receta.service';
import { CombinacionRecetaController } from './combinacion-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CombinacionReceta,
  combinacionRecetaSchema,
} from './schema/combinacion-receta.schema';
import { TratamientoModule } from 'src/tratamiento/tratamiento.module';
import { RangoModule } from 'src/rango/rango.module';
import { MarcaLenteModule } from 'src/marca-lente/marca-lente.module';
import { TipoColorLenteModule } from 'src/tipo-color-lente/tipo-color-lente.module';
import { TipoLenteModule } from 'src/tipo-lente/tipo-lente.module';
import { MaterialModule } from 'src/material/material.module';
import { ColorLenteModule } from 'src/color-lente/color-lente.module';
import { PreciosModule } from 'src/precios/precios.module';
import { ComisionProductoModule } from 'src/comision-producto/comision-producto.module';
import { ComisionRecetaModule } from 'src/comision-receta/comision-receta.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CombinacionReceta.name,
        schema: combinacionRecetaSchema,
      },
    ]),
    TratamientoModule,
    MarcaLenteModule,
    RangoModule,
    TipoColorLenteModule,
    TipoLenteModule,
    MaterialModule,
    ColorLenteModule,
    PreciosModule,
    ComisionRecetaModule
  ],
  controllers: [CombinacionRecetaController],
  providers: [CombinacionRecetaService],
  exports: [CombinacionRecetaService],
})
export class CombinacionRecetaModule {}
