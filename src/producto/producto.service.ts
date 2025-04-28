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
import { DataProductoI, productosExcelI } from './interface/dataProducto';
import { verificarProductoI } from './interface/verificaProducto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { ComisionProductoService } from 'src/comision-producto/comision-producto.service';
import { log } from 'console';

@Injectable()
export class ProductoService {
  constructor(
    @InjectModel(Producto.name) private readonly producto: Model<Producto>,
    private readonly colorService: ColorService,
    private readonly marcaService: MarcaService,
    private readonly tipoMonturaService: TipoMonturaService,
    private readonly precioService: PreciosService,

    private readonly preciosService: PreciosService,
    private readonly comisionProductoService: ComisionProductoService,
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
      const producto = await this.producto.create(dataProducto);
      for (const p of data.precios) {
        const precio = await this.preciosService.guardarPrecioReceta(
          p.tipoPrecio,
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

  async verificarProducto(codigoMia:string) {
    const producto = await this.producto.aggregate([
      {
        $match: {
          codigoMia: codigoMia,
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
        $project: {
          tipoProducto: 1,
          marca: { $arrayElemAt: ['$marca.nombre', 0] },
        },
      },
    ]);

 
    return producto[0]
  }

  async verificarProductoventa(
    producto: Types.ObjectId,
  ): Promise<verificarProductoI> {
    const productos: verificarProductoI[] = await this.producto.aggregate([
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
    const producto = await this.producto.aggregate([
      {
        $match: {
          tipoProducto: productoE.gafa,
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
        $project: {
          codigoMia: 1,
          tipoProducto: 1,
          marca: '$marca.nombre',
          serie: 1,
          color: '$color.nombre',
          categoria: 1,
          codigoQR: 1,
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

  async guardaProductoComisiones(data: productosExcelI) {
    const producto = await this.producto.findOne({ codigoMia: data.codigoMia });
    
    if (!producto) {
      console.log('no existe prodcuto',data.codigoMia, data.tipoProducto, data.precio);
      
      const [color, marca] = await Promise.all([
        this.colorService.guardarColor(data.color),
        this.marcaService.guardarMarca(data.marca),
      ]);

      const dataProducto: DataProductoI = {
        codigoMia: data.codigoMia,
        tipoProducto: data.tipoProducto,
        marca: marca._id,
        color: color._id,
        serie: data.serie,
        codigoQR: data.codigoQR,
      };
      if (data.tipoProducto == productoE.montura) {
        const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(
          data.tipoMontura,
        );
        dataProducto.tipoMontura = tipoMontura._id;
      }

      const producto = await this.producto.create(dataProducto);
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);

      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.producto,
        producto._id,
        precio._id,
      );

      if (data.precio === precio.nombre) {
        let contador: number = 0;
        for (const com of data.comisiones) {
          contador++;
          const nombre = `Comision ${contador}`;

          await this.comisionProductoService.guardarComisionProducto(
            producto._id,
            com.monto.result,
            com.comision.result,
            nombre,
            data.precio,
          );
        }
      }
    } else {
      console.log('existe prodcuto',data.codigoMia, data.tipoProducto, data.precio);
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);

      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.producto,
        producto._id,
        precio._id,
      );

      if (data.precio === precio.nombre) {
        let contador: number = 0;
        for (const com of data.comisiones) {
          contador++;
          const nombre = `Comision ${contador}`;
          await this.comisionProductoService.guardarComisionProducto(
            producto._id,
            com.monto.result,
            com.comision.result,
            nombre,
            data.precio,
          );
        }
      }
    }
  }

  async guardaProductoExcel(data: productosExcelI) {
    const [color, marca] = await Promise.all([
      this.colorService.guardarColor(data.color),
      this.marcaService.guardarMarca(data.marca),
    ]);

    const dataProducto: DataProductoI = {
      codigoMia: data.codigoMia,
      tipoProducto: data.tipoProducto,
      marca: marca._id,
      color: color._id,
      serie: data.serie,
      codigoQR: data.codigoQR,
    };
    if (data.tipoProducto == productoE.montura) {
      const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(
        data.tipoMontura,
      );
      dataProducto.tipoMontura = tipoMontura._id;
    }

    const producto = await this.producto.exists({ codigoMia: data.codigoMia });
    if (!producto) {
      const productoRegistrado = await this.producto.create(dataProducto);
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.producto,
        productoRegistrado._id,
        precio._id,
      );
    } else {
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.producto,
        producto._id,
        precio._id,
      );
    }
  }
}
