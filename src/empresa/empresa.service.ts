import { Injectable } from '@nestjs/common';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Empresa } from './schema/empresa.schema';
import { Model } from 'mongoose';

@Injectable()
export class EmpresaService {
  constructor(@InjectModel(Empresa.name) private readonly empresa:Model<Empresa>){}
  create(createEmpresaDto: CreateEmpresaDto) {
    return 'This action adds a new empresa';
  }

  findAll() {
    return `This action returns all empresa`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empresa`;
  }

  update(id: number, updateEmpresaDto: UpdateEmpresaDto) {
    return `This action updates a #${id} empresa`;
  }

  remove(id: number) {
    return `This action removes a #${id} empresa`;
  }
  async guardarEmpresa(nombre:string){
    const empresa = await this.empresa.findOne({
      nombre: nombre,
    });
    if (!empresa) {
     return  await this.empresa.create({nombre:nombre});
    }
    return empresa
    
  }



}
