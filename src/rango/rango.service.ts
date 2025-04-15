import { Injectable } from '@nestjs/common';
import { CreateRangoDto } from './dto/create-rango.dto';
import { UpdateRangoDto } from './dto/update-rango.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rango } from './schema/rango.schema';
import { Model } from 'mongoose';

@Injectable()
export class RangoService {

   constructor(@InjectModel(Rango.name) private readonly rango:Model<Rango>){}
      
      async guardarRangoLente (nombre:string) {
        const rango = await this.rango.findOne({nombre:nombre.toUpperCase()})
        if(!rango) {
          return await this.rango.create({nombre:nombre.toUpperCase()})
        }
        return rango
      }
  create(createRangoDto: CreateRangoDto) {
    return 'This action adds a new rango';
  }

  findAll() {
    return `This action returns all rango`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rango`;
  }

  update(id: number, updateRangoDto: UpdateRangoDto) {
    return `This action updates a #${id} rango`;
  }

  remove(id: number) {
    return `This action removes a #${id} rango`;
  }
}
