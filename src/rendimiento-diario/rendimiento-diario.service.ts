import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';
import { Request } from 'express';
import { RendimientoDiario } from './schema/rendimientoDiarioSchema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { VentaService } from 'src/venta/services/venta.service';
import { dataEmpresa } from 'src/sucursal/util/data';
import { rendimientoI } from './interface/rendimiento';
import { flag } from 'src/core/enum/flag';
import { BuscadorRendimientoDiarioDto } from './dto/BuscardorRendimientoDiario';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import { FechasDto } from 'src/core/dto/FechasDto';
@Injectable()
export class RendimientoDiarioService {
  constructor(
    @InjectModel(RendimientoDiario.name)
    private readonly rendimientoDiario: Model<RendimientoDiario>,
    @Inject(forwardRef(() => VentaService)) private readonly ventasService: VentaService,
  ) {}
  async create(
    createRendimientoDiarioDto: CreateRendimientoDiarioDto,
    request: Request,
  ) {
    if (!request.usuario.idUsuario || !request.usuario.asesor) {
      throw new BadRequestException(
        'Deve tener una sucursal asignada para este registro',
      );
    }

    const asesor: Types.ObjectId = new Types.ObjectId(request.usuario.asesor);
    const date = new Date();
    const diaRegistro: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const verificar = await this.rendimientoDiario.countDocuments({
      asesor: new Types.ObjectId(asesor),
      fechaDia: diaRegistro,
      flag: flag.nuevo,
    });
    if (verificar > 0) {
      throw new ConflictException(
        `Rendiemiento de la fecha ${diaRegistro} ya fue registrado`,
      );
    }

    await this.rendimientoDiario.create({
      ...createRendimientoDiarioDto,
      asesor: asesor,
      fechaDia: diaRegistro,
    });
    return { status: HttpStatus.CREATED };
  }

  async findAll(buscadorRendimientoDiarioDto: BuscadorRendimientoDiarioDto) {
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

            const resultado: rendimientoI = {
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
            return resultado;
          }),
        );

        return {
          sucursal: item.sucursal,
          asesor: item.asesor,
          metas:item.metas,
          ventas: resultado,
        };
      }),
    );
  

    
    return rendimiento;
  }

  async listarRendimientoDiarioAsesor(
    request: Request,
    paginadorDto: PaginadorDto,
  ) {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          flag: 'nuevo',
          ...(request.usuario.asesor && {
            asesor: new Types.ObjectId(request.usuario.asesor),
          }),
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
        $sort: { fecha: -1 },
      },
      {
        $skip: skip(paginadorDto.pagina, paginadorDto.limite),
      },
      {
        $limit: paginadorDto.limite,
      },
    ];

    const [countDocuments, rendimiento] = await Promise.all([
      this.rendimientoDiario.countDocuments({
        ...(request.usuario.asesor && {
          asesor: new Types.ObjectId(request.usuario.asesor),
        }),
      }),
      this.rendimientoDiario.aggregate(pipeline),
    ]);

    const paginas = calcularPaginas(countDocuments, paginadorDto.limite);

    return {
      paginas: paginas,
      paginaActual: paginadorDto.pagina,
      data: rendimiento,
    };
  }

  async rendimientoDiarioAsesor(request: Request) {
    if (!request.usuario.asesor) {
      throw new NotFoundException(
        'Su usuario deve estar vinculado a un asesor',
      );
    }

    const ventas =
      await this.ventasService.ventasParaRendimientoDiarioAsesor(request);
    const data = await Promise.all(
      ventas.map(async (item) => {
        let antireflejos: number = 0;
        let progresivos: number = 0;
        for (const receta of item.receta) {
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
          fechaDia: item.fecha,
          asesor: item.asesorId,
          flag: flag.nuevo,
        });

        const resultado: rendimientoI = {
          asesor: item.asesor,
          antireflejos: antireflejos,
          atenciones: rendimientoDia ? rendimientoDia.atenciones : 0,
          cantidadLente: item.lente,
          entregas: item.entregadas,
          lc: item.lc,
          montoTotalVentas: item.montoTotal,
          progresivos: progresivos,
          fecha: item.fecha,
          idAsesor: item.asesorId,
          segundoPar: rendimientoDia ? rendimientoDia.segundoPar : 0,
          ticket: item.ticket,
        };
        return resultado;
      }),
    );
 
    
    return data;
  }
  async update(
    updateRendimientoDiarioDto: UpdateRendimientoDiarioDto,
    id: Types.ObjectId,
  ) {
    const date = new Date();
    const rendimiento = await this.rendimientoDiario.findOne({
      _id: new Types.ObjectId(id),
    });
    const diaRegistro: string = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (rendimiento) {
      if (rendimiento.fechaDia == diaRegistro) {
        return await this.rendimientoDiario.updateOne(
          { _id: new Types.ObjectId(id) },
          updateRendimientoDiarioDto,
        );
      }
       throw new BadRequestException("Tua tiempo de edicion expiro")
    }
    throw new NotFoundException();
  }

  public async listarRedimientoDiarioDia(asesor:Types.ObjectId[], dia:string){
    const rendimiento = await this.rendimientoDiario.find({flag:flag.nuevo, fechaDia:dia, asesor:{$in: asesor.map((item)=> new Types.ObjectId(item)) }})
    return rendimiento
  
  }
}
