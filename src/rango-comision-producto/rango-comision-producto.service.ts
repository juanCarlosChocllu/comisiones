import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRangoComisionProductoDto } from './dto/create-rango-comision-producto.dto';
import { PreciosService } from 'src/precios/service/precios.service';
import { RangoComisionProducto } from './schema/rangoComisionProducto.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';
@Injectable()
export class RangoComisionProductoService {
  constructor(
    @InjectModel(RangoComisionProducto.name)
    private readonly rangoComisionProducto: Model<RangoComisionProducto>,
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

    const precio = await this.precioService.buscarPrecioPorId(
      createRangoComisionProductoDto.precio,
    );
    if (!precio) {
      throw new NotFoundException('Tipo precio no encontrado');
    }

    const rango = await this.rangoComisionProducto.findOne({
      precio: precio._id,
      nombre: createRangoComisionProductoDto.nombre,
      $or: [
        {
          precioMinimo: { $lte: createRangoComisionProductoDto.precioMaximo },
          precioMaximo: { $gt: createRangoComisionProductoDto.precioMinimo },
        },
      ],
    });
    if (rango) {
      throw new ConflictException('Ya existe un rango que se cruza con este.');
    }
    return this.rangoComisionProducto.create({
      nombrePrecio: precio.nombre,
      precio: precio._id,
      precioMaximo: createRangoComisionProductoDto.precioMaximo,
      precioMinimo: createRangoComisionProductoDto.precioMinimo,
      comision: createRangoComisionProductoDto.comision,
      nombre: createRangoComisionProductoDto.nombre,
    });
  }

  listarComision() {
    return this.rangoComisionProducto
      .find({ flag: flag.nuevo })
      .sort({ fecha: -1 });
  }

  async buscarComisionProductoPorRango(precio: string, importe: number) {
    const comision = await this.rangoComisionProducto.aggregate([
      {
        $match: {
          nombrePrecio: precio,
          precioMinimo: { $lte: importe },
          precioMaximo: { $gte: importe },
        },
      },
      {
        $project: {
          _id: 0,
          precio: '$nombrePrecio',
          monto: '$comision',
        },
      },
    ]);

    return comision;
  }
}
