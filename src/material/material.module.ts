import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Material, materialSchema } from './schema/material.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name:Material.name, schema:materialSchema
      }
    ])
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
