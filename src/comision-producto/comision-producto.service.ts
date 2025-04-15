import { Injectable } from '@nestjs/common';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { UpdateComisionProductoDto } from './dto/update-comision-producto.dto';

@Injectable()
export class ComisionProductoService {
  create(createComisionProductoDto: CreateComisionProductoDto) {
    return 'This action adds a new comisionProducto';
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
