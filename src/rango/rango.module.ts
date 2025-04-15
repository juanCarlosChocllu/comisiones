import { Module } from '@nestjs/common';
import { RangoService } from './rango.service';
import { RangoController } from './rango.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rango, rangoSchema } from './schema/rango.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
     {
      name:Rango.name, schema:rangoSchema
     }
    ])
  ],
  controllers: [RangoController],
  providers: [RangoService],
  exports: [RangoService]
})
export class RangoModule {}
