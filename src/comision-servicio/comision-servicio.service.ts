import { Injectable } from '@nestjs/common';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionServicio } from './schema/comision-servicio.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ComisionServicioService {
    constructor(@InjectModel(ComisionServicio.name) private readonly comisionServicio:Model<ComisionServicio>){}
  
  
  async listarComosionPoraServicio(servicio:Types.ObjectId, precio:string) {
    const comisiones = await this.comisionServicio
    .find(
      {
        precio: precio,
        servicio: new Types.ObjectId(servicio),
      },
      { monto: 1, precio: 1 },
    )
    .lean();
  return comisiones;
  }


   async guardarComisionServicio(
     servicio: Types.ObjectId,
     monto: number,
     comision: number,
     nombre: string,
     precio: string,
   ) {

    
     const diferencia = comision | 0 - monto | 0;
  
     
     const data = await this.comisionServicio.exists({
       servicio: new Types.ObjectId(servicio),
       comision: comision,
       diferencia: diferencia,
       monto: monto | 0,
       nombre: nombre,
       precio: precio,
     });
     if (!data) {
       await this.comisionServicio.create({
         servicio: new Types.ObjectId(servicio),
         comision: comision,
         diferencia: diferencia,
         monto: monto|0,
         nombre: nombre,
         precio: precio,
       });
     }
   }

  }
