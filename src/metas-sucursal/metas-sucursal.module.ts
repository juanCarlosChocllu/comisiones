import { Module } from '@nestjs/common';
import { MetasSucursalService } from './metas-sucursal.service';
import { MetasSucursalController } from './metas-sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MetasSucursal, metasSucursalSchema } from './schema/metasSucursalSchema';
import { SucursalModule } from 'src/sucursal/sucursal.module';

@Module({
   imports:[
    SucursalModule,
      MongooseModule.forFeature([
      {
        name:MetasSucursal.name, schema: metasSucursalSchema
      },
      
   ])],
  controllers: [MetasSucursalController],
  providers: [MetasSucursalService],
})
export class MetasSucursalModule {}
