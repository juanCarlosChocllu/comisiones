import { Injectable } from '@nestjs/common';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asesor } from './schema/asesor.schema';
import { Model, Types } from 'mongoose';
import { ScursalAsesorI } from './interface/sucursalAsesor';

@Injectable()
export class AsesorService {
  constructor(@InjectModel(Asesor.name) private readonly asesor:Model<Asesor>){}
  create(createAsesorDto: CreateAsesorDto) {
    return 'This action adds a new asesor';
  }

  async listarAsesor(sucursal:Types.ObjectId) {
    const asesor:ScursalAsesorI[] = await this.asesor.aggregate([
      {
        $match:{
          sucursal:new Types.ObjectId(sucursal)
        }
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
        $unwind:{path:'$sucursal', preserveNullAndEmptyArrays:false}
      },

      {
        $lookup:{
          from:'Empresa',
          foreignField:'_id',
          localField:'sucursal.empresa',
          as:'empresa'
        }
      },
      {
        $unwind:{path:'$empresa', preserveNullAndEmptyArrays:false}
      },
      {
        $project:{
          nombre:1,
          sucursalNombre:'$sucursal.nombre',
          idSucursal:'$sucursal._id',
          empresa:'$empresa.nombre'
      
        }
      }
    ])
    return asesor
  }

  

  async guardarAsesor(nombre:string, sucursal:Types.ObjectId){
    const asesor = await this.asesor.findOne({nombre:nombre.toUpperCase(), sucursal:sucursal})
    if(!asesor){
      return  await this.asesor.create({nombre:nombre.toUpperCase(), sucursal:sucursal})
    }
    return asesor
   }
   
}
