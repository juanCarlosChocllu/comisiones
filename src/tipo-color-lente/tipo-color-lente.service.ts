import { Injectable } from '@nestjs/common';
import { CreateTipoColorLenteDto } from './dto/create-tipo-color-lente.dto';
import { UpdateTipoColorLenteDto } from './dto/update-tipo-color-lente.dto';
import { TipoColorLente } from './schema/tipoColorLente.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TipoColorLenteService {
  constructor(@InjectModel(TipoColorLente.name) private readonly tipoColorLente:Model<TipoColorLente>){}
    async guardarTipoColorLente (nombre:string) {
      const tipoColorLente = await this.tipoColorLente.findOne({nombre:nombre.toUpperCase()})
      if(!tipoColorLente) {
        return await this.tipoColorLente.create({nombre:nombre.toUpperCase()})
      }
      return tipoColorLente
    }
  findAll() {
    return `This action returns all tipoColorLente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoColorLente`;
  }

  update(id: number, updateTipoColorLenteDto: UpdateTipoColorLenteDto) {
    return `This action updates a #${id} tipoColorLente`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoColorLente`;
  }
}
