import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRangoComisionProductoDto } from './dto/create-rango-comision-producto.dto';
import { PreciosService } from 'src/precios/service/precios.service';
import { RangoComisionProducto } from './schema/rangoComisionProducto.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';
import { DetalleRangoComisionProducto } from './schema/DetalleRangoComisonProducto';
import { BuscadorRangoComisionProductoDto } from './schema/BuscadorRangoComisionProductoDto';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import * as ExcelJs from 'exceljs';
@Injectable()
export class RangoComisionProductoService {
  constructor(
    @InjectModel(RangoComisionProducto.name)
    private readonly rangoComisionProducto: Model<RangoComisionProducto>,
    @InjectModel(DetalleRangoComisionProducto.name)
    private readonly detalleRangoComisionProducto: Model<DetalleRangoComisionProducto>,
    private readonly precioService: PreciosService,
  ) {}
  async crearComision(
    createRangoComisionProductoDto: CreateRangoComisionProductoDto,
  ) {
    if (
      createRangoComisionProductoDto.precioMinimo >
      createRangoComisionProductoDto.precioMaximo
    ) {
      throw new ConflictException(
        'El precio Maximo deve ser mayor que el minimo',
      );
    }

    const nombreRango = await this.rangoComisionProducto.findOne({
      nombre: createRangoComisionProductoDto.nombre,
      flag: flag.nuevo,
    });

    if (nombreRango) {
      throw new ConflictException('El nombre del rango ya existe');
    }

    await this.validarRangosProducto(createRangoComisionProductoDto);

    const nombre = await this.rangoComisionProducto.create({
      nombre: createRangoComisionProductoDto.nombre,
      precioMaximo: createRangoComisionProductoDto.precioMaximo,
      precioMinimo: createRangoComisionProductoDto.precioMinimo,
    });
    for (const item of createRangoComisionProductoDto.detalle) {
      const precio = await this.precioService.buscarPrecioPorId(item.precio);
      await this.detalleRangoComisionProducto.create({
        nombrePrecio: precio.nombre,
        precio: precio._id,
        comision: item.comision,
        rangoComisionProducto: nombre._id,
      });
    }
  }

  async validarRangosProducto(
    createRangoComisionProductoDto: CreateRangoComisionProductoDto,
  ) {
    for (const item of createRangoComisionProductoDto.detalle) {
      const rango = await this.rangoComisionProducto.aggregate([
        {
          $match: {
            precioMinimo: { $lt: createRangoComisionProductoDto.precioMaximo },
            precioMaximo: { $gt: createRangoComisionProductoDto.precioMinimo },
            flag: flag.nuevo,
          },
        },
        {
          $lookup: {
            from: 'DetalleRangoComisionProducto',
            foreignField: 'rangoComisionProducto',
            localField: '_id',
            as: 'detalleRangoComisonProducto',
          },
        },
        {
          $unwind: {
            path: '$detalleRangoComisonProducto',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            'detalleRangoComisonProducto.precio': new Types.ObjectId(
              item.precio,
            ),
          },
        },
        {
          $count: 'total',
        },
      ]);
      console.log(rango);
      
      if (rango.length > 0 && rango[0].total >= 2) {
        const precio = await this.precioService.buscarPrecioPorId(item.precio);
        throw new ConflictException(
       `Máximo 2 comisiones por tipo de precio ${precio.nombre} en rangos superpuestos (ya hay ${rango[0].total}).`,
        );
      }
    }
  }
  async listarComision(
    buscadorRangoComisionProductoDto: BuscadorRangoComisionProductoDto,
  ) {
    const filtro = {
      ...(buscadorRangoComisionProductoDto.nombre && {
        nombre: new RegExp(buscadorRangoComisionProductoDto.nombre, 'i'),
      }),
      ...(buscadorRangoComisionProductoDto.precioMinimo && {
        precioMinimo: { $gte: buscadorRangoComisionProductoDto.precioMinimo },
      }),
      ...(buscadorRangoComisionProductoDto.precioMaximo && {
        precioMaximo: { $lte: buscadorRangoComisionProductoDto.precioMaximo },
      }),
      flag: flag.nuevo,
    };

    const pipeline: PipelineStage[] = [
      {
        $match: filtro,
      },

      {
        $skip: skip(
          buscadorRangoComisionProductoDto.pagina,
          buscadorRangoComisionProductoDto.limite,
        ),
      },
      {
        $limit: buscadorRangoComisionProductoDto.limite,
      },

      {
        $lookup: {
          from: 'DetalleRangoComisionProducto',
          let: { rangoId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$rangoComisionProducto', '$$rangoId'] },
                    { $eq: ['$flag', flag.nuevo] },
                    ...(buscadorRangoComisionProductoDto.precio
                      ? [
                          {
                            $regexMatch: {
                              input: '$nombrePrecio',
                              regex: new RegExp(
                                buscadorRangoComisionProductoDto.precio,
                                'i',
                              ),
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                comision: 1,
                nombrePrecio: 1,
                precio: 1,
              },
            },
          ],
          as: 'detalleRangoComisonProducto',
        },
      },

      {
        $match: {
          detalleRangoComisonProducto: { $ne: [] },
        },
      },
      {
        $sort: { fecha: -1 },
      },
    ];

    const [countDocuments, rangos] = await Promise.all([
      this.rangoComisionProducto.countDocuments(filtro),

      this.rangoComisionProducto.aggregate(pipeline),
    ]);

    const pagina = calcularPaginas(
      countDocuments,
      buscadorRangoComisionProductoDto.limite,
    );

    return { data: rangos, pagina: pagina };
  }
  async descargarExcel(
    buscadorRangoComisionProductoDto: BuscadorRangoComisionProductoDto,
  ) {
    const filtro = {
      ...(buscadorRangoComisionProductoDto.nombre && {
        nombre: new RegExp(buscadorRangoComisionProductoDto.nombre, 'i'),
      }),
      ...(buscadorRangoComisionProductoDto.precioMinimo && {
        precioMinimo: { $gte: buscadorRangoComisionProductoDto.precioMinimo },
      }),
      ...(buscadorRangoComisionProductoDto.precioMaximo && {
        precioMaximo: { $lte: buscadorRangoComisionProductoDto.precioMaximo },
      }),
      flag: flag.nuevo,
    };

    const pipeline: PipelineStage[] = [
      {
        $match: filtro,
      },

      {
        $lookup: {
          from: 'DetalleRangoComisionProducto',
          foreignField: 'rangoComisionProducto',
          localField: '_id',
          as: 'detalleRangoComisonProducto',
        },
      },
      {
        $unwind: {
          path: '$detalleRangoComisonProducto',
          preserveNullAndEmptyArrays: false,
        },
      },
      ...(buscadorRangoComisionProductoDto.precio ? [
        {
          $match:{
          'detalleRangoComisonProducto.nombrePrecio':new RegExp(buscadorRangoComisionProductoDto.precio, 'i')
          }
        }
      ]:[

      ]),
      {
        $group: {
          _id: '$detalleRangoComisonProducto.precio',
          precioMinimo: { $first: '$precioMinimo' },
          precioMaximo: { $first: '$precioMaximo' },
          nombre: { $first: '$nombre' },
          precio: { $first: '$detalleRangoComisonProducto.nombrePrecio' },
          comision: { $push: '$detalleRangoComisonProducto.comision' },
        },
      },
      {
        $sort: { fecha: -1 },
      },
    ];
    const data = await this.rangoComisionProducto.aggregate(pipeline);
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet('hoja 1');
    worksheet.columns = [
      { header: 'nombre', key: 'nombre', width: 20 },
      { header: 'precioMinimo', key: 'precioMinimo', width: 10 },
      { header: 'precioMaximo', key: 'precioMaximo', width: 10 },
      { header: 'precio', key: 'precio', width: 10 },
      { header: 'comision1', key: 'comision1', width: 10 },
      { header: 'comision2', key: 'comision2', width: 10 },
    ];

    for (const item of data) {
      let com1: number = Math.max(...item.comision) | 0;
      let com2: number = Math.min(...item.comision) | 0;

      worksheet.addRow({
        nombre: item.nombre,
        precioMinimo: item.precioMinimo,
        precioMaximo: item.precioMaximo,
        precio: item.precio,
        comision1: com1,
        comision2: com2,
      });
    }
    return workbook;
  }
  async buscarComisionProductoPorRango(precio: string, importe: number) {
    const comision = await this.rangoComisionProducto.aggregate([
      {
        $match: {
          precioMinimo: { $lte: importe },
          precioMaximo: { $gte: importe },
          flag: flag.nuevo,
        },
      },
      {
        $lookup: {
          from: 'DetalleRangoComisionProducto',
          foreignField: 'rangoComisionProducto',
          localField: '_id',
          as: 'detalleRangoComisionProducto',
        },
      },
      {
        $unwind: {
          path: '$detalleRangoComisionProducto',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          'detalleRangoComisionProducto.nombrePrecio': precio,
        },
      },
      {
        $project: {
          _id: 0,
          precio: '$detalleRangoComisionProducto.nombrePrecio',
          monto: '$detalleRangoComisionProducto.comision',
        },
      },
    ]);

    return comision;
  }

  async eliminarComision(id: Types.ObjectId) {
    const rango = await this.rangoComisionProducto.findById(id);
    if (!rango) {
      throw new NotFoundException();
    }
    await this.rangoComisionProducto.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    await this.detalleRangoComisionProducto.updateMany(
      { rangoComisionProducto: rango._id },
      { flag: flag.eliminado },
    );
  }
}
