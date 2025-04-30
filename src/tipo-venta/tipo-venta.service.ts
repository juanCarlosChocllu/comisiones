import { Injectable } from '@nestjs/common';
import { CreateTipoVentaDto } from './dto/create-tipo-venta.dto';
import { UpdateTipoVentaDto } from './dto/update-tipo-venta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { TipoVenta } from './schema/tipo-venta.schema';
import { Model } from 'mongoose';

@Injectable()
export class TipoVentaService {
  constructor(@InjectModel(TipoVenta.name) private readonly tipoVenta:Model<TipoVenta>){}
  create(createTipoVentaDto: CreateTipoVentaDto) {
    return 'This action adds a new tipoVenta';
  }

  async listarTipoDeVenta() {
    const  tipoVentas = await this.tipoVenta.find()
    return  tipoVentas;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoVenta`;
  }

  update(id: number, updateTipoVentaDto: UpdateTipoVentaDto) {
    return `This action updates a #${id} tipoVenta`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoVenta`;
  }


    async guardarTipoVenta(nombre:string){
      const tipoVenta = await  this.tipoVenta.findOne({nombre:nombre.toUpperCase()})
      if(!tipoVenta){
         return await this.tipoVenta.create({nombre:nombre.toUpperCase()})
      }
      return tipoVenta
    } 


}
