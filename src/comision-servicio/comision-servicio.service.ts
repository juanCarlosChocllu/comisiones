import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionServicio } from './schema/comision-servicio.schema';
import { Model, Types } from 'mongoose';
import { ServicioService } from 'src/servicio/servicio.service';
import { flag } from 'src/core/enum/flag';

@Injectable()
export class ComisionServicioService {
    constructor(
      @InjectModel(ComisionServicio.name) private readonly comisionServicio:Model<ComisionServicio>,
      private readonly servicioService:ServicioService
    ){}
  
  
  async listarComosionPoraServicio(servicio:Types.ObjectId, precio:string) {
    const comisiones = await this.comisionServicio
    .find(
      {
        precio: precio,
        servicio: new Types.ObjectId(servicio),
        flag:flag.nuevo
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
   async crearComision(createComisionServicioDto:CreateComisionServicioDto) {
      await this.servicioService.asignaComisionServicio(createComisionServicioDto.servicio)
     let contador=0
      for (const data of createComisionServicioDto.data) {
        contador ++ 
        await this.comisionServicio.create({
          ...data,
          nombre: data.nombre ? data.nombre : `comision ${contador}`,
          servicio: new Types.ObjectId(
            createComisionServicioDto.servicio,
          ),
        });
      }
      return {status:HttpStatus.OK}

   }

     
  }
