import { Module } from '@nestjs/common';

import { TratamientoController } from './tratamiento.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Tratamiento, tratamientoSchema } from './schema/tratamiento.schema';
import { TratamientoService } from './services/tratamiento.service';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Tratamiento.name, schema:tratamientoSchema
      }
    ])
  ],
  controllers: [TratamientoController],
  providers: [TratamientoService],
  exports:[TratamientoService]
})
export class TratamientoModule {}
