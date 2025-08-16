import { Injectable } from '@nestjs/common';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';

@Injectable()
export class RendimientoDiarioService {
  create(createRendimientoDiarioDto: CreateRendimientoDiarioDto) {
    return 'This action adds a new rendimientoDiario';
  }

  findAll() {
    return `This action returns all rendimientoDiario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rendimientoDiario`;
  }

  update(id: number, updateRendimientoDiarioDto: UpdateRendimientoDiarioDto) {
    return `This action updates a #${id} rendimientoDiario`;
  }

  remove(id: number) {
    return `This action removes a #${id} rendimientoDiario`;
  }
}
