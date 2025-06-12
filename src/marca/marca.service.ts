import { Injectable } from '@nestjs/common';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Marca } from './schema/marca.schema';
import { Model } from 'mongoose';

@Injectable()
export class MarcaService {
  constructor(@InjectModel(Marca.name) private readonly marca:Model<Marca>){}
  create(createMarcaDto: CreateMarcaDto) {
    return 'This action adds a new marca';
  }

 async  listar() {
    const marca= await this.marca.find()
    return marca
  }

  findOne(id: number) {
    return `This action returns a #${id} marca`;
  }

  update(id: number, updateMarcaDto: UpdateMarcaDto) {
    return `This action updates a #${id} marca`;
  }

  remove(id: number) {
    return `This action removes a #${id} marca`;
  }


  async guardarMarca(nombre:string){
    const marca= await this.marca.findOne({nombre:nombre.toUpperCase()})
    if(!marca){
      return await this.marca.create({nombre:nombre})
    } 
    return marca
  }
}
