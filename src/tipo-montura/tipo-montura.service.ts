import { Injectable } from '@nestjs/common';
import { CreateTipoMonturaDto } from './dto/create-tipo-montura.dto';
import { UpdateTipoMonturaDto } from './dto/update-tipo-montura.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TipoMontura } from './schema/tipo-montura.schema';
import { Model } from 'mongoose';

@Injectable()
export class TipoMonturaService {
  constructor(@InjectModel(TipoMontura.name) private readonly tipoMontura:Model<TipoMontura>){}
  create(createTipoMonturaDto: CreateTipoMonturaDto) {
    return 'This action adds a new tipoMontura';
  }

  findAll() {
    return `This action returns all tipoMontura`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoMontura`;
  }

  update(id: number, updateTipoMonturaDto: UpdateTipoMonturaDto) {
    return `This action updates a #${id} tipoMontura`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoMontura`;
  }


  async guardarTipoMontura(nombre:string){
    const tipoMontura= await this.tipoMontura.findOne({nombre:nombre.toUpperCase()})
    if(!tipoMontura){
      return await this.tipoMontura.create({nombre:nombre})
    } 
    return tipoMontura
  }
}
