import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionReceta } from './schema/comision-receta.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ComisionRecetaService {
  constructor(@InjectModel(ComisionReceta.name) private readonly comisionReceta:Model<ComisionReceta>){}
  async create(createComisionRecetaDto: CreateComisionRecetaDto) {
    createComisionRecetaDto.combinacionReceta= new Types.ObjectId(createComisionRecetaDto.combinacionReceta)
    await this.comisionReceta.create(createComisionRecetaDto)
    return {status:HttpStatus.CREATED}
  }

  findAll() {
    return `This action returns all comisionReceta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comisionReceta`;
  }

  update(id: number, updateComisionRecetaDto: UpdateComisionRecetaDto) {
    return `This action updates a #${id} comisionReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} comisionReceta`;
  }
}
