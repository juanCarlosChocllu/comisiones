import { Module } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sucursal, sucursaSchema } from './schema/sucursal.schema';
import { EmpresaModule } from 'src/empresa/empresa.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Sucursal.name, schema:sucursaSchema}]), EmpresaModule],
  controllers: [SucursalController],
  providers: [SucursalService],
  exports:[SucursalService],

})
export class SucursalModule {}
