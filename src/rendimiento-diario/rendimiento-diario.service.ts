import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';
import { Request } from 'express';
import { RendimientoDiario } from './schema/rendimientoDiarioSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { VentaService } from 'src/venta/services/venta.service';
import { dataEmpresa } from 'src/sucursal/util/data';
import { rendimientoI } from './interface/rendimiento';
import { flag } from 'src/core/enum/flag';
import { BuscadorRendimientoDiarioDto } from './dto/BuscardorRendimientoDiario';
@Injectable()
export class RendimientoDiarioService {
  constructor(
    @InjectModel(RendimientoDiario.name)
    private readonly rendimientoDiario: Model<RendimientoDiario>,
    private readonly ventasService: VentaService,
  ) {}
  async create(
    createRendimientoDiarioDto: CreateRendimientoDiarioDto,
    request: Request,
  ) {
    if (!request.usuario.idUsuario || !request.usuario.asesor) {
      throw new BadRequestException(
        'Deve tener una sucrsal asignada para este registro',
      );
    }
    const asesor: Types.ObjectId = new Types.ObjectId(request.usuario.asesor);
    const date = new Date();
    const diaRegistro: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    await this.rendimientoDiario.create({
      ...createRendimientoDiarioDto,
      asesor: asesor,
      fechaDia: diaRegistro,
    });
    return { status: HttpStatus.CREATED };
  }

  async findAll(buscadorRendimientoDiarioDto: BuscadorRendimientoDiarioDto) {
    console.log(buscadorRendimientoDiarioDto);
    
    const ventas = await this.ventasService.ventasParaRendimientoDiario(
      buscadorRendimientoDiarioDto,
    );

    

    const rendimiento = await Promise.all(
      ventas.map(async (item) => {
        const resultado = await Promise.all(
          item.ventas.map(async (data) => {
          
            
            let antireflejos: number = 0;
            let progresivos: number = 0;
            for (const receta of data.receta) {
              const data = receta.descripcion.split('/');

              const tipoLente = data[1];
              const tratamiento = data[3];  
              if (tipoLente === 'PROGRESIVO') {
                progresivos += 1;
              }
              if (
                tratamiento === 'ANTIREFLEJO' ||
                tratamiento === 'BLUE SHIELD' ||
                tratamiento === 'GREEN SHIELD' ||
                tratamiento === 'CLARITY' ||
                tratamiento === 'CLARITY PLUS' ||
                tratamiento === 'STOP AGE' 
              ) {
                antireflejos += 1;
              }
            }
     
            
            const rendimientoDia = await this.rendimientoDiario.findOne({
              fechaDia: data.fecha,
              asesor: data.asesorId,
              flag: flag.nuevo,
            });
    
            
            const resulado: rendimientoI = {
              asesor: data.asesor,
              antireflejos: antireflejos,
              atenciones: rendimientoDia ? rendimientoDia.atenciones : 0,
              cantidadLente: data.lente,
              entregas: data.entregadas,
              lc: data.lc,
              montoTotalVentas: data.montoTotal,
              progresivos: progresivos,
              fecha: data.fecha,
              idAsesor: data.asesorId,
              segundoPar: rendimientoDia ? rendimientoDia.segundoPar : 0,
              ticket: data.ticket,
            };
            return resulado;
          }),
        );

        return {
          sucursal: item.sucursal,
          asesor: item.asesor,
          ventas: resultado,
        };
      }),
    );

    return rendimiento;
  }

  async listarRendimientoDiarioAsesor(request:Request) {
  

    const rendimiento = await this.rendimientoDiario.aggregate([
      {
        $match: {
          flag: 'nuevo',
          ...(request.usuario.asesor) && {asesor:new Types.ObjectId(request.usuario.asesor)}
        },
      },
      {
        $lookup: {
          from: 'Asesor',
          foreignField: '_id',
          localField: 'asesor',
          as: 'asesor',
        },
      },
      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'asesor.sucursal',
          as: 'sucursal',
        },
      },
      {
        $project: {
          asesor: { $arrayElemAt: ['$asesor.nombre', 0] },
          sucursal: { $arrayElemAt: ['$sucursal.nombre', 0] },
          atenciones: 1,
          segundoPar: 1,
          fecha: 1,
          fechaDia: 1,
        },
      },
      {
        $sort:{fecha:-1}
      }
    ]);
    console.log(rendimiento);

    return rendimiento;
  }
}
