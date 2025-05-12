import { ConflictException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetasProductoVipDto } from './dto/create-metas-producto-vip.dto';
import { UpdateMetasProductoVipDto } from './dto/update-metas-producto-vip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MetasProductoVip } from './schema/metas-producto-vip.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';


@Injectable()
export class MetasProductoVipService {
  constructor(@InjectModel(MetasProductoVip.name) private readonly metasProductoVip:Model<MetasProductoVip>){}
  async create(createMetasProductoVipDto: CreateMetasProductoVipDto) {
    for (const data of createMetasProductoVipDto.data) {
         data.sucursal = new Types.ObjectId(data.sucursal)
         const meta= await this.verificarMetaExistente(data.sucursal)  
         if(!meta) {
           await this.metasProductoVip.create(data)
         } else {
          throw new ConflictException('La meta a la sucursal ya se encuentra registrada');
         }
         
    } 
    return {status:HttpStatus.CREATED};
  }

  async verificarMetaExistente (sucursal:Types.ObjectId) {
    const meta= await this.metasProductoVip.findOne({sucursal:new Types.ObjectId(sucursal), flag:flag.nuevo})
    if(meta) {
      return true
    }
    return false

  } 

  async listarMetasProductosVipPorSucursal(sucursal:Types.ObjectId){
    const metas  = await this.metasProductoVip.findOne({sucursal:new Types.ObjectId(sucursal), flag:flag.nuevo},{lenteDeContacto:1,monturaMasGafa:1}).lean()
    return metas
  }
  async listar() {
    const metas = await this.metasProductoVip.aggregate([
      {
        $match:{flag:flag.nuevo}
      },
      {
        $lookup:{
          from:'Sucursal',
          foreignField:'_id',
          localField:'sucursal',
          as:'sucursal'
        }
      },
      {
        $project:{
          monturaMasGafa:1,
          lenteDeContacto:1,
          sucursal:{$arrayElemAt:['$sucursal.nombre', 0]}
        }

      }
    ])
    return metas;
  }

  async findOne(id: Types.ObjectId) {
    const meta = await this.metasProductoVip.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})    
    if(!meta) {
      throw new NotFoundException();
    }
    return  meta;
  }

  async actulizar(id: Types.ObjectId, updateMetasProductoVipDto: UpdateMetasProductoVipDto) {
    const meta = await this.metasProductoVip.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
    if(!meta) {
      throw new NotFoundException();
    }
    await this.metasProductoVip.updateOne({_id:new Types.ObjectId(id)},updateMetasProductoVipDto)
    return {status:HttpStatus.OK}  
  }

  async softDelete(id:Types.ObjectId){
    const meta = await this.metasProductoVip.findOne({_id:new Types.ObjectId(id), flag:flag.nuevo})
    if(!meta) {
      throw new NotFoundException();
    }
   await this.metasProductoVip.updateOne({_id:new Types.ObjectId(id)},{flag:flag.eliminado})
    return {status:HttpStatus.OK}  
  }
}
