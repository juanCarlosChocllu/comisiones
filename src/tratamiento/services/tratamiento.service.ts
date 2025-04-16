import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tratamiento } from '../schema/tratamiento.schema';
import { UpdateTratamientoDto } from '../dto/update-tratamiento.dto';

@Injectable()
export class TratamientoService {
  constructor(@InjectModel(Tratamiento.name) private readonly tratamiento:Model<Tratamiento>){}
 

  async guardarTratamiento (nombre:string) {
    const tratamiento = await this.tratamiento.findOne({nombre:nombre.toUpperCase()})
    if(!tratamiento) {
      return await this.tratamiento.create({nombre:nombre.toUpperCase()})
    }
    return tratamiento
  }

  async verificarTratamiento (nombre:string) {
    const tratamiento = await this.tratamiento.findOne({nombre:nombre.toUpperCase()})
    return tratamiento
  }
  findAll() {
    return `This action returns all tratamiento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tratamiento`;
  }

  update(id: number, updateTratamientoDto: UpdateTratamientoDto) {
    return `This action updates a #${id} tratamiento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tratamiento`;
  }
}
