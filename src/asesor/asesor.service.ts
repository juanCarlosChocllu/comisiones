import { HttpStatus, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asesor } from './schema/asesor.schema';
import { Model, Types } from 'mongoose';
import { ScursalAsesorI } from './interface/sucursalAsesor';
import { from } from 'rxjs';

@Injectable()
export class AsesorService {
  constructor(
    @InjectModel(Asesor.name) private readonly asesor: Model<Asesor>,
  ) {}
  create(createAsesorDto: CreateAsesorDto) {
    return 'This action adds a new asesor';
  }

  async listar() {
    const asesor: ScursalAsesorI[] = await this.asesor.aggregate([
      
      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'sucursal',
          as: 'sucursal',
        },
      },

      {
        $project: {
          nombre: 1,
          sucursalNombre: { $arrayElemAt: ['$sucursal.nombre', 0] },
          idSucursal: { $arrayElemAt: ['$sucursal._id', 0] },
          gestor: 1,
        },
      },
    ]);
    console.log(asesor);
    
    return asesor;
  }

  async listarAsesor(sucursal: Types.ObjectId[]) {
    const asesor: ScursalAsesorI[] = await this.asesor.aggregate([
      {
        $match: {
          sucursal: { $in: sucursal.map((id) => new Types.ObjectId(id)) },
        },
      },

      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'sucursal',
          as: 'sucursal',
        },
      },

      {
        $lookup: {
          from: 'Empresa',
          foreignField: '_id',
          localField: 'sucursal.empresa',
          as: 'empresa',
        },
      },

      {
        $project: {
          nombre: 1,
          sucursalNombre: { $arrayElemAt: ['$sucursal.nombre', 0] },
          idSucursal: { $arrayElemAt: ['$sucursal._id', 0] },
          empresa: { $arrayElemAt: ['$empresa.nombre', 0] },
          gestor: 1,
        },
      },
    ]);
    return asesor;
  }

  async guardarAsesor(nombre: string, sucursal: Types.ObjectId) {
    const asesor = await this.asesor.findOne({
      nombre: nombre.toUpperCase(),
      sucursal: sucursal,
    });
    if (!asesor) {
      return await this.asesor.create({
        nombre: nombre.toUpperCase(),
        sucursal: sucursal,
      });
    }
    return asesor;
  }

  async asesorEmpresa(asesor: Types.ObjectId) {
    const empresa = await this.asesor.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(asesor),
        },
      },
      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'sucursal',
          as: 'sucursal',
        },
      },
      {
        $lookup: {
          from: 'Empresa',
          foreignField: '_id',
          localField: 'sucursal.empresa',
          as: 'empresa',
        },
      },
      {
        $project: {
          empresa: { $arrayElemAt: ['$empresa.nombre', 0] },
          sucursal: { $arrayElemAt: ['$usucrsal._id', 0] },
        },
      },
    ]);
    return empresa[0];
  }

  async asesorService(gestor:boolean, id:Types.ObjectId){
    try {
      const asesor = await this.asesor.findOne({_id:new Types.ObjectId(id)})
      if(!asesor){
        throw new NotAcceptableException();
      }
      await this.asesor.updateOne({_id:new Types.ObjectId(id)},{gestor:gestor})
      return {status:HttpStatus.OK}
    } catch (error) {
      throw error
    }

    
  }
}
