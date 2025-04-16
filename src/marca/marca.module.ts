import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Marca, marcaSchema } from './schema/marca.schema';

@Module({
   imports:[
        MongooseModule.forFeature([
          {
            name:Marca.name, schema:marcaSchema
          }
        ])
      ],
  controllers: [MarcaController],
  providers: [MarcaService],
  exports: [MarcaService]
})
export class MarcaModule {}
