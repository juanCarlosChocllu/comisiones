import { Injectable } from '@nestjs/common';
import { CreateTipoLenteDto } from './dto/create-tipo-lente.dto';
import { UpdateTipoLenteDto } from './dto/update-tipo-lente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TipoLente } from './schema/tipoLente.schema';
import { Model } from 'mongoose';

@Injectable()
export class TipoLenteService {
   constructor(@InjectModel(TipoLente.name) private readonly tipoLente:Model<TipoLente>){}
   async guardarTipoLente (nombre:string) {
     const tipoLente = await this.tipoLente.findOne({nombre:nombre.toUpperCase()})
     if(!tipoLente) {
      return  await this.tipoLente.create({nombre:nombre.toUpperCase()})
     }
     return tipoLente
   }

   async verificarTipoLente (nombre:string) {
    const tipoLente = await this.tipoLente.findOne({nombre:nombre.toUpperCase()})
    return tipoLente
  }
  findAll() {
    return `This action returns all tipoLente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoLente`;
  }

  update(id: number, updateTipoLenteDto: UpdateTipoLenteDto) {
    return `This action updates a #${id} tipoLente`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoLente`;
  }
}
