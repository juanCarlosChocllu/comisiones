import { Injectable } from '@nestjs/common';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';

@Injectable()
export class ComisionServicioService {
  create(createComisionServicioDto: CreateComisionServicioDto) {
    return 'This action adds a new comisionServicio';
  }

  findAll() {
    return `This action returns all comisionServicio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comisionServicio`;
  }

  update(id: number, updateComisionServicioDto: UpdateComisionServicioDto) {
    return `This action updates a #${id} comisionServicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} comisionServicio`;
  }
}
