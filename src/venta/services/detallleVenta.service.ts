import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DetalleVenta } from "../schema/venta.schema";
import { Model, Types } from "mongoose";
import { detalleVentaI } from "../interface/detalleVenta";


@Injectable()
export class DetalleVentaService {
  constructor(@InjectModel(DetalleVenta.name) private readonly detalleVenta:Model<DetalleVenta>) {}
   async guardarDetalleVenta(data:detalleVentaI){
     const detalle = await this.detalleVenta.findOne({rubro:data.rubro, venta:data.venta})
     if(!detalle) {
      return this.detalleVenta.create(data)
     }
  
   } 

   async listarDetalleVenta(venta:Types.ObjectId){
    const detalle = await this.detalleVenta.find({venta:venta})
    return detalle
   }
}
