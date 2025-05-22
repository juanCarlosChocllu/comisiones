import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { flag } from 'src/core/enum/flag';
import { calcularPaginas, skip } from 'src/core/utils/paginador';
import { BuscadorVentaDto } from 'src/venta/dto/buscadorVenta.dto,';
import { BuscadorProductoDto } from './dto/BuscadorProducto.dto';
import { CrearProductoDto } from './dto/crearProduto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectModel(Producto.name) private readonly producto: Model<Producto>,
    private readonly colorService: ColorService,
    private readonly marcaService: MarcaService,
    private readonly tipoMonturaService: TipoMonturaService,
    private readonly precioService: PreciosService,

    private readonly preciosService: PreciosService,
    @Inject(forwardRef(() => ComisionProductoService))
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

  async guardarProducto(data: productosExcelI) {
    //datal color
    const color = await this.colorService.guardarColor(data.color);
    const marca = await this.marcaService.guardarMarca(data.color);

    const dataProducto: DataProductoI = {
      codigoMia: data.codigoMia,
      tipoProducto: data.tipoProducto,
      marca: marca._id,
      color: color._id,
      serie: data.serie,
      categoria: data.categoria,
      codigoQR: data.codigoQR,
      comision: false,
    };
    if (data.tipoProducto == productoE.montura) {
      const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(
        data.tipoMontura,
      );
      dataProducto.tipoMontura = tipoMontura._id;
    }
    const producto = await this.producto.create(dataProducto);
    const precioEcontrado = await this.preciosService.buscarPrecioPorNombre(
      data.precio,
    );
    await this.preciosService.guardarDetallePrecio(
      tipoProductoPrecio.producto,
      producto._id,
      precioEcontrado._id,
      data.importe,
    );
    return producto;
  }

  async verificarProducto(codigoMia: string) {
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

    return producto[0];
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
  async listarProductosSinComision(BuscadorProductoDto: BuscadorProductoDto) {
    const { data, paginas } = await this.productoListar(
      BuscadorProductoDto,
      false,
    );
    return { data: data, paginas: paginas };
  }
  async listarProductos(
    BuscadorProductoDto: BuscadorProductoDto,
    rubro: productoE,
  ) {
    const { data, paginas } = await this.productoListar(
      BuscadorProductoDto,
      true,
      rubro,
    );
    return { data: data, paginas: paginas };
  }
  private async productoListar(
    BuscadorProductoDto: BuscadorProductoDto,
    comision: boolean,
    rubro?: string | null,
  ) {
    const match = {
      flag: flag.nuevo,
      ...(comision === false ? { comision: comision } : {}),
      ...(rubro ? { tipoProducto: rubro } : {}),
    };
    const producto = await this.producto.aggregate([
      {
        $match: {
          ...match,
          ...(BuscadorProductoDto.serie
            ? { serie: new RegExp(BuscadorProductoDto.serie, 'i') }
            : {}),
          ...(BuscadorProductoDto.codigoQr
            ? { codigoQR: new RegExp(BuscadorProductoDto.codigoQr, 'i') }
            : {}),
          ...(BuscadorProductoDto.tipoProducto
            ? {
                tipoProducto: new RegExp(BuscadorProductoDto.tipoProducto, 'i'),
              }
            : {}),
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
        $unwind: { path: '$marca', preserveNullAndEmptyArrays: true },
      },
      ...(BuscadorProductoDto.marca
        ? [
            {
              $match: {
                'marca.nombre': new RegExp(BuscadorProductoDto.marca, 'i'),
              },
            },
          ]
        : []),

      {
        $lookup: {
          from: 'Color',
          foreignField: '_id',
          localField: 'color',
          as: 'color',
        },
      },
      {
        $unwind: { path: '$color', preserveNullAndEmptyArrays: true },
      },
      ...(BuscadorProductoDto.color
        ? [
            {
              $match: {
                'color.nombre': new RegExp(BuscadorProductoDto.color, 'i'),
              },
            },
          ]
        : []),
      {
        $lookup: {
          from: 'ComisionProducto',
          foreignField: 'producto',
          localField: '_id',
          as: 'comisionProducto',
        },
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
          comisionProducto: 1,
        },
      },
      {
        $skip: skip(BuscadorProductoDto.pagina, BuscadorProductoDto.limite),
      },
      {
        $limit: BuscadorProductoDto.limite,
      },
    ]);
    const total = await this.producto.countDocuments(match);
    const pagina = calcularPaginas(total, BuscadorProductoDto.limite);
    return { data: producto, paginas: pagina };
  }

  async asignaComisionProducto(id: Types.ObjectId) {
    const producto = await this.producto.findOne({
      _id: new Types.ObjectId(id),
      comision: false,
    });

    if (producto) {
      console.log(producto);
      return await this.producto.updateOne(
        { _id: new Types.ObjectId(id) },
        { comision: true },
      );
    }
  }

  async guardaProductoComisiones(data: productosExcelI) {
    const producto = await this.producto.findOne({ codigoMia: data.codigoMia });

    if (!producto) {
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
      console.log(
        'existe prodcuto',
        data.codigoMia,
        data.tipoProducto,
        data.precio,
      );
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

  async crearProducto(crearProductoDto: CrearProductoDto) {
    console.log(crearProductoDto);
    
    const producto = await this.producto.findOne({
      codigoMia: crearProductoDto.codigoMia,
    });
    if (producto) {
      for (const data of crearProductoDto.precios) {
        const precio = await this.precioService.buscarPrecioPorNombre(
          data.tipoPrecio,
        );
        await this.precioService.guardarDetallePrecio(
          tipoProductoPrecio.producto,
          producto._id,
          precio._id,
          data.precio,
        );
      }
    } else {
      const [color, marca] = await Promise.all([
        this.colorService.guardarColor(crearProductoDto.color),
        this.marcaService.guardarMarca(crearProductoDto.marca),
      ]);
      const dataProducto: DataProductoI = {
        codigoMia: crearProductoDto.codigoMia,
        tipoProducto: crearProductoDto.tipoProducto,
        marca: marca._id,
        color: color._id,
        serie: crearProductoDto.serie,
        codigoQR: crearProductoDto.codigoQR,
      };
      if (crearProductoDto.tipoProducto == productoE.montura) {
        const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(
          crearProductoDto.tipoMontura,
        );
        dataProducto.tipoMontura = tipoMontura._id;
      }
      const producto = await this.producto.create(dataProducto);

      for (const data of crearProductoDto.precios) {
        const precio = await this.precioService.buscarPrecioPorNombre(
          data.tipoPrecio,
        );
        await this.precioService.guardarDetallePrecio(
          tipoProductoPrecio.producto,
          producto._id,
          precio._id,
          data.precio,
        );
      }
    }
  }
}
