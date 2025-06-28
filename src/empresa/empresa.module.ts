import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Empresa, empresaSchema } from './schema/empresa.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name:Empresa.name, schema:empresaSchema
  }])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
  exports: [EmpresaService, MongooseModule],
})
export class EmpresaModule {}
