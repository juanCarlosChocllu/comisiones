import { Module } from '@nestjs/common';
import { TipoColorLenteService } from './tipo-color-lente.service';
import { TipoColorLenteController } from './tipo-color-lente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoColorLente, tipoColorLenteSchema } from './schema/tipoColorLente.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:TipoColorLente.name, schema:tipoColorLenteSchema
      }
    ])
  ],
  controllers: [TipoColorLenteController],
  providers: [TipoColorLenteService],
  exports: [TipoColorLenteService]
})
export class TipoColorLenteModule {}
