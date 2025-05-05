import { forwardRef, Module } from '@nestjs/common';
import { ComisionRecetaService } from './comision-receta.service';
import { ComisionRecetaController } from './comision-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComisionReceta, comisionRecetaSchema } from './schema/comision-receta.schema';
import { CombinacionRecetaModule } from 'src/combinacion-receta/combinacion-receta.module';

@Module({ 
    imports:[
      MongooseModule.forFeature([
        {
          name:ComisionReceta.name, schema:comisionRecetaSchema
        },
      
      ]),
      forwardRef(()=> CombinacionRecetaModule)
    ],
  controllers: [ComisionRecetaController],
  providers: [ComisionRecetaService],
  exports: [ComisionRecetaService]
})
export class ComisionRecetaModule {}
