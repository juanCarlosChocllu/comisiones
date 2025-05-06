import { Injectable } from '@nestjs/common';
import { CreatePrecioDto } from '../dto/create-precio.dto';
import { UpdatePrecioDto } from '../dto/update-precio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Precio } from '../schema/precio.schema';
import { Model, Types } from 'mongoose';
import { DetallePrecio } from '../schema/detallePrecio.schema';
import { productoE } from 'src/providers/enum/productos';
import { tipoProductoPrecio } from '../enum/tipoProductoPrecio';
import { Type } from 'class-transformer';
import { preciosI } from '../interface/precios';

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

   async guardarPrecioReceta(nombre:string){
      const precio = await this.precio.findOne({nombre:nombre.toUpperCase()})
      if(!precio) {
        return await this.precio.create({nombre:nombre.toUpperCase()})
      }
      return precio
   }

   async  guardarDetallePrecio(tipo:tipoProductoPrecio,producto:Types.ObjectId, precio:Types.ObjectId , monto:number = 0){
    
    
      if(tipo === tipoProductoPrecio.lente) {
          const detalle = await this.detallePrecio.findOne({combinacionReceta:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:tipo , monto:monto})
        
          if(!detalle) {
            await this.detallePrecio.create({combinacionReceta:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:tipo, monto:monto })
          }
      }else {
        const detalle= await this.detallePrecio.findOne({producto:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:tipoProductoPrecio.producto ,  monto:monto})
        if(!detalle) {
          await this.detallePrecio.create({producto:new Types.ObjectId(producto), precio:new Types.ObjectId(precio), tipo:tipoProductoPrecio.producto , monto:monto})
        }
      }

   }
  

   async detallePrecioCombinacion (combinacion:Types.ObjectId){
    const detalle = await this.detallePrecio.find({combinacionReceta:combinacion, tipo:tipoProductoPrecio.lente})
    const dataPrecio:preciosI[]=[]
    for (const data of detalle) {
        const precio = await this.precio.findOne({_id:data.precio})
        dataPrecio.push(precio)
    }
    return dataPrecio
    
   }

   async detallePrecioProducto (producto:Types.ObjectId){
    const detalle = await this.detallePrecio.find({producto:producto, tipo:tipoProductoPrecio.producto})
    const dataPrecio:preciosI[]=[]
    for (const data of detalle) {
        const precio = await this.precio.findOne({_id:data.precio})
        dataPrecio.push(precio)
    }
    return dataPrecio
    
   }

  async listarTiposDePrecioCombinacion(id:Types.ObjectId){
      const precios:preciosI[] =[]
      const detalle = await this.detallePrecio.find({combinacionReceta:new Types.ObjectId(id),tipo:tipoProductoPrecio.lente})
      for (const data of detalle) {
       const precio=   await this.precio.find({_id:data.precio})
       precios.push(...precio)
      }
      return precios
       
    }
    async listarTiposDePrecioProducto(id:Types.ObjectId){
      const precios:preciosI[] =[]
      const detalle = await this.detallePrecio.find({producto:new Types.ObjectId(id),tipo:tipoProductoPrecio.producto})
      for (const data of detalle) {
       const precio=   await this.precio.find({_id:data.precio})
       precios.push(...precio)
      }
      return precios
       
    
    }


    async buscarPrecioPorNombre(nombre:string){
      const precio = await this.precio.findOne({nombre:nombre.toUpperCase()})
      if(!precio) {
        return await this.precio.create({nombre:nombre.toUpperCase()})
      }

      return precio
    }
}
