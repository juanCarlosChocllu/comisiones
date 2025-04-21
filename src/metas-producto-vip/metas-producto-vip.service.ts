import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateMetasProductoVipDto } from './dto/create-metas-producto-vip.dto';
import { UpdateMetasProductoVipDto } from './dto/update-metas-producto-vip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MetasProductoVip } from './schema/metas-producto-vip.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MetasProductoVipService {
  constructor(@InjectModel(MetasProductoVip.name) private readonly metasProductoVip:Model<MetasProductoVip>){}
  async create(createMetasProductoVipDto: CreateMetasProductoVipDto) {
    for (const data of createMetasProductoVipDto.data) {
         data.sucursal = new Types.ObjectId(data.sucursal)
         await this.metasProductoVip.create(data)
    } 
    return {status:HttpStatus.CREATED};
  }

  async listarMetasProductosVipPorSucursal(sucursal:Types.ObjectId){
    const metas  = await this.metasProductoVip.findOne({sucursal:new Types.ObjectId(sucursal)})
    return metas
  }
  findAll() {
    return `This action returns all metasProductoVip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metasProductoVip`;
  }

  update(id: number, updateMetasProductoVipDto: UpdateMetasProductoVipDto) {
    return `This action updates a #${id} metasProductoVip`;
  }

  remove(id: number) {
    return `This action removes a #${id} metasProductoVip`;
  }
}
