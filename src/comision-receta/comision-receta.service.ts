import { Injectable } from '@nestjs/common';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';

@Injectable()
export class ComisionRecetaService {
  create(createComisionRecetaDto: CreateComisionRecetaDto) {
    return 'This action adds a new comisionReceta';
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
