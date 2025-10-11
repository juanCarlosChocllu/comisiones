import { forwardRef, Module } from '@nestjs/common';
import { ComisionRecetaService } from './comision-receta.service';
import { ComisionRecetaController } from './comision-receta.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ComisionReceta, comisionRecetaSchema } from './schema/comision-receta.schema';
@Module({ 
    imports:[
      MongooseModule.forFeature([
        {
          name:ComisionReceta.name, schema:comisionRecetaSchema
        },
      ])
    ],
  controllers: [ComisionRecetaController],
  providers: [ComisionRecetaService],
  exports: [ComisionRecetaService]
})
export class ComisionRecetaModule {}
