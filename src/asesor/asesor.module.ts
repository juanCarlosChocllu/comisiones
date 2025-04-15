import { Module } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { AsesorController } from './asesor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Asesor, asesorSchema } from './schema/asesor.schema';

@Module({
    imports:[
      MongooseModule.forFeature([
        {
          name:Asesor.name, schema:asesorSchema
        }
      ])
    ],
  controllers: [AsesorController],
  providers: [AsesorService],
  exports:[AsesorService]
})
export class AsesorModule {}
