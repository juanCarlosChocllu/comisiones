import { Injectable } from '@nestjs/common';
import { CreateRangoComisionDto } from './dto/create-rango-comision.dto';
import { UpdateRangoComisionDto } from './dto/update-rango-comision.dto';

@Injectable()
export class RangoComisionService {
  create(createRangoComisionDto: CreateRangoComisionDto) {
    return 'This action adds a new rangoComision';
  }

  findAll() {
    return `This action returns all rangoComision`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rangoComision`;
  }

  update(id: number, updateRangoComisionDto: UpdateRangoComisionDto) {
    return `This action updates a #${id} rangoComision`;
  }

  remove(id: number) {
    return `This action removes a #${id} rangoComision`;
  }
}
