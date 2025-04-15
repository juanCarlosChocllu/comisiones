import { Injectable } from '@nestjs/common';
import { CreateColorLenteDto } from './dto/create-color-lente.dto';
import { UpdateColorLenteDto } from './dto/update-color-lente.dto';
import { ColorLente } from './schema/colorLente.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ColorLenteService {
  constructor(@InjectModel(ColorLente.name) private readonly colorLente:Model<ColorLente>){}
      async guardarColorLente (nombre:string) {
        const colorLente = await this.colorLente.findOne({nombre:nombre.toUpperCase()})
        if(!colorLente) {
         return await this.colorLente.create({nombre:nombre.toUpperCase()})
        }
        return colorLente
      }
  findAll() {
    return `This action returns all colorLente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} colorLente`;
  }

  update(id: number, updateColorLenteDto: UpdateColorLenteDto) {
    return `This action updates a #${id} colorLente`;
  }

  remove(id: number) {
    return `This action removes a #${id} colorLente`;
  }
}
