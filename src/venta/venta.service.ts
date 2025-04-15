import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Venta } from './schema/venta.schema';
import { Model } from 'mongoose';

@Injectable()
export class VentaService {
  constructor(@InjectModel(Venta.name) private readonly venta:Model<Venta>){}
  create(createVentaDto: CreateVentaDto) {
    return 'This action adds a new venta';
  }

  findAll() {
    return `This action returns all venta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }

   async guardarVenta(venta:VentaI){
    await this.venta.create(venta)

  }
}
