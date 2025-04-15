import { Module } from '@nestjs/common';
import { MarcaLenteService } from './marca-lente.service';
import { MarcaLenteController } from './marca-lente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MarcaLente, marcaLenteSchema } from './schema/marca-lente.entity';

@Module({
    imports:[MongooseModule.forFeature([{
      name:MarcaLente.name, schema:marcaLenteSchema
    }])],
  controllers: [MarcaLenteController],
  providers: [MarcaLenteService],
  exports: [MarcaLenteService]
})

export class MarcaLenteModule {}
