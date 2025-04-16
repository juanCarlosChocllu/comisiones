import { Module } from '@nestjs/common';
import { EmpresaModule } from './empresa/empresa.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { AsesorModule } from './asesor/asesor.module';
import { MaterialModule } from './material/material.module';
import { TratamientoModule } from './tratamiento/tratamiento.module';
import { MarcaLenteModule } from './marca-lente/marca-lente.module';
import { RangoModule } from './rango/rango.module';
import { TipoLenteModule } from './tipo-lente/tipo-lente.module';
import { ColorLenteModule } from './color-lente/color-lente.module';
import { TipoColorLenteModule } from './tipo-color-lente/tipo-color-lente.module';
import { VentaModule } from './venta/venta.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoreModule } from './core/core.module';
import { PreciosModule } from './precios/precios.module';
import { ProvidersModule } from './providers/providers.module';
import { ComisionRecetaModule } from './comision-receta/comision-receta.module';
import { ComisionProductoModule } from './comision-producto/comision-producto.module';
import { CombinacionRecetaModule } from './combinacion-receta/combinacion-receta.module';
import { ProductoModule } from './producto/producto.module';
import { MarcaModule } from './marca/marca.module';
import { TipoMonturaModule } from './tipo-montura/tipo-montura.module';
import { ColorModule } from './color/color.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://kanna:kanna@localhost:27017/comision?authSource=admin',
    ),
    EmpresaModule,
    SucursalModule,
    AsesorModule,
    MaterialModule,
    TratamientoModule,
    MarcaLenteModule,
    RangoModule,
    TipoLenteModule,
    ColorLenteModule,
    TipoColorLenteModule,
    VentaModule,
    CoreModule,
    PreciosModule,
    ProvidersModule,
    ComisionRecetaModule,
    ComisionProductoModule,
    CombinacionRecetaModule,
    ProductoModule,
    MarcaModule,
    TipoMonturaModule,
    ColorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
