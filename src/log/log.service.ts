import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LogUsuario } from './schema/logUsuario.Schema';
import { Model } from 'mongoose';
import { LogActividadI, LogI } from './interface/log';
import { LogActividad } from './schema/logActividad';
import { BuscadorLogActividadDto } from './dto/BuscadorLogActividad.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(LogUsuario.name) private readonly Log: Model<LogUsuario>,
    @InjectModel(LogActividad.name)
    private readonly logActividad: Model<LogActividad>,
  ) {}

  async registrarLog(data: LogI) {
    try {
      await this.Log.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  async registrarActividad(data: LogActividadI) {
    return this.logActividad.create(data);
  }

  async listarLogUsuario(buscadorLogActividadDto: BuscadorLogActividadDto) {
    return this.Log.find({
      fecha: {
        $gte: buscadorLogActividadDto.fechaInicio,
        $lte: buscadorLogActividadDto.fechaFin,
      },
    }).sort({feha:-1});
  }
  async listar(buscadorLogActividadDto: BuscadorLogActividadDto) {
    const actividad = await this.logActividad.aggregate([
      {
        $match: {
          fecha: {
            $gte: buscadorLogActividadDto.fechaInicio,
            $lte: buscadorLogActividadDto.fechaFin,
          },
        },
      },
      {
        $lookup: {
          from: 'Usuario',
          foreignField: '_id',
          localField: 'usuario',
          as: 'usuario',
        },
      },
      {
        $project: {
          accion: 1,
          descripcion: 1,
          ip: 1,
          navegador: 1,
          path: 1,
          schema: 1,
          body: 1,
          usuario: { $arrayElemAt: ['$usuario.username', 0] },
          fecha:1
        },
      },

      {
        $sort: { fecha: -1 },
      },
    ]);
    return actividad;
  }
}
