import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { UpdateComisionProductoDto } from './dto/update-comision-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionProducto } from './schema/comision-producto.schema';
import { Model } from 'mongoose';

@Injectable()
export class ComisionProductoService {
  constructor(@InjectModel(ComisionProducto.name) private readonly  comisionProducto:Model<ComisionProducto>){}
   async create(createComisionProductoDto: CreateComisionProductoDto) {
    await this.comisionProducto.create(createComisionProductoDto)
    return  {status:HttpStatus.CREATED};
  }

  findAll() {
    return `This action returns all comisionProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comisionProducto`;
  }

  update(id: number, updateComisionProductoDto: UpdateComisionProductoDto) {
    return `This action updates a #${id} comisionProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} comisionProducto`;
  }
}
