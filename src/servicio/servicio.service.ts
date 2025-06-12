import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { exceldataServicioI } from './interface/servicio.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Servicio } from './schema/servicio.schema';
import { Model, Types } from 'mongoose';
import { PreciosService } from 'src/precios/service/precios.service';
import { tipoProductoPrecio } from 'src/precios/enum/tipoProductoPrecio';
import { ComisionServicioService } from 'src/comision-servicio/comision-servicio.service';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

@Injectable()
export class ServicioService {
  constructor(
    @InjectModel(Servicio.name) private readonly servicio: Model<Servicio>,
    private readonly preciosService: PreciosService,
    @Inject(forwardRef(() => ComisionServicioService))
    private readonly comisionServicioService: ComisionServicioService,
  ) {}

  async listarServicios(paginadorDto: PaginadorDto) {
    const servicio = await this.servicio.aggregate([
      {
        $lookup: {
          from: 'ComisionServicio',
          foreignField: 'servicio',
          localField: '_id',
          as: 'comisonServicio',
        },
      },

      {
        $project: {
          nombre: 1,
          comisonServicio: 1,
        },
      },
      {
        $skip: skip(paginadorDto.pagina, paginadorDto.limite),
      },
      {
        $limit: paginadorDto.limite,
      },
    ]);
    const countDocuments = await this.servicio.countDocuments();
    const paginas = calcularPaginas(countDocuments, paginadorDto.limite);
    return { data: servicio, paginas: paginas };
  }

  async buscarServicio(codigoMia: string, tipoPrecio: string) {
    const servicio = await this.servicio.aggregate([
      {
        $match: {
          codigoMia: codigoMia,
        },
      },
      {
        $lookup: {
          from: 'DetallePrecio',
          foreignField: 'servicio',
          localField: '_id',
          as: 'detallePrecio',
        },
      },
      {
        $unwind: { path: '$detallePrecio', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'detallePrecio.precio',
          as: 'precio',
        },
      },
      { $unwind: { path: '$precio', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'precio.nombre': tipoPrecio,
        },
      },
      {
        $project:{
          _id:1
        }
      }
    ]);

    return servicio[0];
  }

  async guardarServicioConSusCOmisiones(data: exceldataServicioI) {
    const servicioExiste = await this.servicio.exists({
      codigoMia: data.codigoMia,
    });
    const precio = await this.preciosService.guardarPrecioReceta(
      data.tipoPrecio,
    );
    const { comisiones, tipoPrecio, ...data2 } = data;
    if (!servicioExiste) {
      const servicio = await this.servicio.create({ ...data2, comision: true });
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.servicio,
        servicio._id,
        precio._id,
        data.monto,
      );
      let contador = 0;
      for (const comision of comisiones) {
        console.log(comision);

        contador++;
        const nombre = `Comison ${contador}`;
        await this.comisionServicioService.guardarComisionServicio(
          servicio._id,
          comision.monto.result,
          comision.comision.result,
          nombre,
          data.tipoPrecio,
        );
      }
    } else {
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.servicio,
        servicioExiste._id,
        precio._id,
        data.monto,
      );
      let contador = 0;
      for (const comision of comisiones) {
        contador++;
        const nombre = `Comison ${contador}`;
        await this.comisionServicioService.guardarComisionServicio(
          servicioExiste._id,
          comision.monto.result,
          comision.comision.result,
          nombre,
          data.tipoPrecio,
        );
      }
    }
  }

  async crearServicio(
    descripcion: string,
    codigoMia: string,
    precio: string,
    importe: number,
    nombre: string,
  ) {
    const  servicio= await this.servicio.findOne({ codigoMia: codigoMia }) 
   const precioEcontrado = await    this.preciosService.buscarPrecioPorNombre(precio)
    if (!servicio) {
      const servicio = await this.servicio.create({
        codigoMia: codigoMia,
        comision: false,
        descripcion: descripcion,
        nombre: nombre,
      });
      
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.servicio,
        servicio._id,
        precioEcontrado._id,
        importe,
      );
      return servicio;
    }else{
      
      
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.servicio,
        servicio._id,
        precioEcontrado._id,
        importe,
      );
      return servicio;
    }
  }

  async listarServiciosSinComision(paginadorDto: PaginadorDto) {
    const servicio = await this.servicio.aggregate([
      {
        $lookup: {
          from: 'DetallePrecio',
          localField: '_id',
          foreignField: 'servicio',
          as: 'detallePrecio',
        },
      },
      { $unwind: '$detallePrecio' },

      {
        $lookup: {
          from: 'Precio',
          localField: 'detallePrecio.precio',
          foreignField: '_id',
          as: 'precio',
        },
      },
      { $unwind: '$precio' },

      {
        $lookup: {
          from: 'ComisionServicio',
          let: { productoId: '$_id', tipoPrecio: '$precio.nombre' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$producto', '$$productoId'] },
                    { $eq: ['$precio', '$$tipoPrecio'] },
                  ],
                },
              },
            },
          ],
          as: 'comisionServicio',
        },
      },

      { $match: { comisionServicio: { $size: 0 } } },
      {
        $project: {
          codigoMia: 1,
          nombre: 1,
          comision: 1,
          descripcion: 1,
          comisionServicio: 1,
        },
      },
    ]);
    const countDocuments = await this.servicio.countDocuments();
    const paginas = calcularPaginas(countDocuments, paginadorDto.limite);
    return { data: servicio, paginas: paginas };
  }

  async asignaComisionServicio(id: Types.ObjectId) {
    const servicio = await this.servicio.findOne({
      _id: new Types.ObjectId(id),
      comision: false,
    });
    if (servicio) {
      return await this.servicio.updateOne(
        { _id: new Types.ObjectId(id) },
        { comision: true },
      );
    }
  }
}
