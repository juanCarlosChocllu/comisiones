import { Module } from '@nestjs/common';

import { ProvidersController } from './controllers/providers.controller';
import { ProvidersService } from './services/providers.service';
import { HttpModule } from '@nestjs/axios';
import { TratamientoModule } from 'src/tratamiento/tratamiento.module';
import { MarcaLenteModule } from 'src/marca-lente/marca-lente.module';
import { RangoModule } from 'src/rango/rango.module';
import { TipoColorLenteModule } from 'src/tipo-color-lente/tipo-color-lente.module';
import { TipoLenteModule } from 'src/tipo-lente/tipo-lente.module';
import { MaterialModule } from 'src/material/material.module';
import { ColorLenteModule } from 'src/color-lente/color-lente.module';
import { AsesorModule } from 'src/asesor/asesor.module';
import { CombinacionRecetaModule } from 'src/combinacion-receta/combinacion-receta.module';
import { SucursalModule } from 'src/sucursal/sucursal.module';
import { VentaModule } from 'src/venta/venta.module';

@Module({
  imports:[HttpModule,
     TratamientoModule,
     MarcaLenteModule, RangoModule, 
    TipoColorLenteModule, TipoLenteModule,
    MaterialModule, ColorLenteModule, AsesorModule, CombinacionRecetaModule, SucursalModule, VentaModule
  ],
  controllers: [ProvidersController],
  providers: [ProvidersService],
})
export class ProvidersModule {}
