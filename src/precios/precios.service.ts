import { Injectable } from '@nestjs/common';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Precio } from './schema/precio.schema';
import { Model, Types } from 'mongoose';
import { DetallePrecio } from './schema/detallePrecio.schema';
import { productoE } from 'src/providers/enum/productos';
import { tipoProductoPrecio } from './enum/tipoProductoPrecio';

@Injectable()
export class PreciosService {
  constructor(
    @InjectModel(Precio.name) private readonly   precio:Model<Precio>,
    @InjectModel(DetallePrecio.name)  private readonly  detallePrecio:Model<DetallePrecio>
 ){}
  create(createPrecioDto: CreatePrecioDto) {
    return 'This action adds a new precio';
  }

  findAll() {
    return `This action returns all precios`;
  }

  findOne(id: number) {
    return `This action returns a #${id} precio`;
  }

  update(id: number, updatePrecioDto: UpdatePrecioDto) {
    return `This action updates a #${id} precio`;
  }

  remove(id: number) {
    return `This action removes a #${id} precio`;
  }

   async guardarPrecioReceta(nombre:string, monto:number){
      const precio = await this.precio.findOne({nombre:nombre.toUpperCase() , monto:monto})
      if(!precio) {
        return await this.precio.create({nombre:nombre.toUpperCase() , monto:monto})
      }
      return precio
   }

   async  guardarDetallePrecio(tipo:tipoProductoPrecio,producto:Types.ObjectId, precio:Types.ObjectId ){
      if(tipo === tipoProductoPrecio.lente) {
         await this.detallePrecio.create({combinacionReceta:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:tipo })
      }else {
        await this.detallePrecio.create({producto:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:'PRODUCTO' })
      }

   }
}
