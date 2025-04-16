import { Injectable } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sucursal } from './schema/sucursal.schema';
import { Model } from 'mongoose';

@Injectable()
export class SucursalService {
  constructor(@InjectModel(Sucursal.name)private readonly sucursal:Model<Sucursal>) {}
  create(createSucursalDto: CreateSucursalDto) {
    return 'This action adds a new sucursal';
  }

  async buscarSucursalPorNombre(nombre:string){
    return this.sucursal.findOne({nombre:nombre.toUpperCase()})
  }

  findAll() {
    return `This action returns all sucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }
}
