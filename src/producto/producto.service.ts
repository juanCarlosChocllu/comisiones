import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ColorService } from 'src/color/color.service';
import { MarcaService } from 'src/marca/marca.service';
import { TipoMonturaService } from 'src/tipo-montura/tipo-montura.service';
import { PreciosService } from 'src/precios/service/precios.service';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schema/producto.schema';
import { Model, Types } from 'mongoose';
import { tipoProductoPrecio } from 'src/precios/enum/tipoProductoPrecio';
import { productoE } from 'src/providers/enum/productos';
import { DataProductoI } from './interface/dataProducto';
import { verificarProductoI } from './interface/verificaProducto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectModel(Producto.name) private readonly prodcuto: Model<Producto>,
    private readonly colorService: ColorService,
    private readonly marcaService: MarcaService,
    private readonly tipoMonturaService: TipoMonturaService,

    private readonly preciosService: PreciosService,
  ) {}
  async create(createProductoDto: CreateProductoDto) {
    for (const data of createProductoDto.data) {
      const color = await this.colorService.guardarColor(data.color);
      const marca = await this.marcaService.guardarMarca(data.marca);

      const dataProducto: DataProductoI = {
        codigoMia: data.codigoMia,
        tipoProducto: data.tipoProducto,
        marca: marca._id,
        color: color._id,
        serie: data.serie,
        categoria: data.categoria,
        codigoQR: data.codigoQR,
        estuchePropio: data.estuchePropio,
      };
      if (data.tipoProducto == productoE.montura) {
        const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(
          data.tipoMontura,
        );
        dataProducto.tipoMontura = tipoMontura._id;
      }
      const producto = await this.prodcuto.create(dataProducto);
      for (const p of data.precios) {
        const precio = await this.preciosService.guardarPrecioReceta(
          p.tipoPrecio,
          p.precio,
        );
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.producto,
          producto._id,
          precio._id,
        );
      }
    }
    return { status: HttpStatus.CREATED };
  }

  async verificarProducto(marca: string, tipoProducto: string) {
    const producto = await this.prodcuto.aggregate([
      {
        $match: {
          tipoProducto: tipoProducto,
        },
      },
      {
        $lookup: {
          from: 'Marca',
          foreignField: '_id',
          localField: 'marca',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },

      {
        $match: {
          'marca.nombre': marca,
        },
      },
      {
        $project: {
          tipoProducto: 1,
          marca: '$marca.nombre',
        },
      },
    ]);

    return producto[0];
  }

  async verificarProductoventa(
    producto: Types.ObjectId,
  ): Promise<verificarProductoI> {
    const productos: verificarProductoI[] = await this.prodcuto.aggregate([
      {
        $match: {
          _id: producto,
        },
      },
      {
        $lookup: {
          from: 'Marca',
          foreignField: '_id',
          localField: 'marca',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          tipoProducto: 1,
          marca: '$marca.nombre',
          categoria: 1,
        },
      },
    ]);

    return productos[0];
  }

  async listarProductos(paginadorDto: PaginadorDto) {
    const producto = await this.prodcuto.aggregate([
      {
        $lookup: {
          from: 'Marca',
          foreignField: '_id',
          localField: 'marca',
          as: 'marca',
        },
      },
      {
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Color',
          foreignField: '_id',
          localField: 'color',
          as: 'color',
        },
      },
      {
        $unwind: { path: '$color', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup:{
          from:'ComisionProducto',
          foreignField:'producto',
          localField:'_id',
          as:'comisiones'
        }
      },
      {
        $project: {
          codigoMia: 1,
          tipoProducto: 1,
          marca: '$marca.nombre',
          serie: 1,
          color: '$color.nombre',
          categoria: 1,
          codigoQR: 1,
          comisiones:1
        },
      },
      {
        $facet: {
          data: [
            {
              $skip: (paginadorDto.pagina - 1) * paginadorDto.limite,
            },
            {
              $limit: paginadorDto.limite,
            },
          ],
          countDocuments: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ]);
    const countDocuments = producto[0].countDocuments[0]
      ? producto[0].countDocuments[0].total
      : 1;
    const paginas = Math.ceil(countDocuments / paginadorDto.limite);
    return { data: producto[0].data, paginas };
  }
}
