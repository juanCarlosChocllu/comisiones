import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DetalleVenta, Venta } from '../schema/venta.schema';
import { Model, Types } from 'mongoose';
import {
  FiltroI,
  RegistroVentas,
  VentaAsesor,
  VentaI,
} from '../interface/venta';
import { AsesorService } from 'src/asesor/asesor.service';
import { DetalleVentaService } from './detallleVenta.service';
import { CombinacionReceta } from 'src/combinacion-receta/schema/combinacion-receta.schema';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { productoE } from 'src/providers/enum/productos';
import { ComisionReceta } from 'src/comision-receta/schema/comision-receta.schema';
import { ComisionRecetaService } from 'src/comision-receta/comision-receta.service';
import { ProductoService } from 'src/producto/producto.service';
import { ComisionProductoService } from 'src/comision-producto/comision-producto.service';
import { MetasProductoVipService } from 'src/metas-producto-vip/metas-producto-vip.service';
import { PreciosService } from 'src/precios/service/precios.service';
import { BuscadorVentaDto } from '../dto/buscadorVenta.dto,';
import { flagVenta } from '../enum/flagVenta';
import { ComisionServicioService } from 'src/comision-servicio/comision-servicio.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectModel(Venta.name) private readonly venta: Model<Venta>,
    @InjectModel(DetalleVenta.name) private readonly DetalleVenta: Model<Venta>,
    private readonly asesorService: AsesorService,
    private readonly detalleVentaService: DetalleVentaService,
    private readonly combinacionRecetaService: CombinacionRecetaService,
    private readonly comisionRecetaService: ComisionRecetaService,
    private readonly productoService: ProductoService,
    private readonly comisionProductoService: ComisionProductoService,
    private readonly metasProductoVipService: MetasProductoVipService,
    private readonly preciosService: PreciosService,
    private readonly comisionServicioService: ComisionServicioService,
  ) {}
  create(createVentaDto: CreateVentaDto) {
    return 'This action adds a new venta';
  }

  async listarVentas(buscadorVentaDto: BuscadorVentaDto) {
    const asesores = await this.asesorService.listarAsesor(
      buscadorVentaDto.sucursal,
    );
    const asesoresProcesados = await Promise.all(
      asesores.map(async (asesor) => {
        const [metas, ventas] = await Promise.all([
          this.metasProductoVipService.listarMetasProductosVipPorSucursal(
            asesor.idSucursal,
          ),
          this.listarVentasPorAsesor(
            asesor._id,
            buscadorVentaDto.fechaInicio,
            buscadorVentaDto.fechaFin,
            buscadorVentaDto.tipoVenta,
          ),
        ]);
        const ventaAsesor: RegistroVentas = {
          metaProductosVip: metas,
          sucursal: asesor.sucursalNombre,
          asesor: asesor.nombre,
          empresa: asesor.empresa,

          gafaVip: 0,
          monturaVip: 0,
          lenteDeContacto: 0,
          montoTotal: 0,
          totalDescuento: 0,
          ventas: [],
        };

        const ventasProcesadas = await Promise.all(
          ventas.map(async (venta) => {
            const detalleProcesado = await Promise.all(
              venta.detalleVenta.map(async (detalle) => {
                if (detalle.rubro === productoE.lente) {
                  const comisiones =
                    await this.comisionRecetaService.listarComisionReceta(
                      venta.precio,
                      detalle.combinacionReceta,
                    );

                  return {
                    combinacion: {
                      descripcion: detalle.descripcion,
                      id: detalle.combinacionReceta,
                    },
                    importe: detalle.importe,
                    comisiones: comisiones.map((com) => ({
                      monto: com.monto,
                      precio: com.precio,
                    })),
                  };
                } else if (
                  detalle.rubro === productoE.montura ||
                  detalle.rubro === productoE.lenteDeContacto ||
                  detalle.rubro === productoE.gafa
                ) {
                  const comisiones =
                    await this.comisionProductoService.listarComosionPorProducto(
                      detalle.producto,
                      venta.precio,
                    );
                  return {
                    producto: {
                      id: detalle._id,
                      tipo: detalle.rubro,
                      marca: detalle.marca,
                      descripcion: detalle.descripcion,
                    },
                    importe: detalle.importe,
                    comisiones: comisiones.map((com) => ({
                      monto: com.monto,
                      precio: com.precio,
                    })),
                  };
                } else if (detalle.rubro === productoE.servicio) {
                  const comisiones =
                    await this.comisionServicioService.listarComosionPoraServicio(
                      detalle.servicio,
                      venta.precio,
                    );

                  return {
                    servicios: {
                      id: detalle._id,
                      tipo: detalle.rubro,
                      descripcion: detalle.descripcion,
                    },
                    importe: detalle.importe,
                    comisiones: comisiones.map((com) => ({
                      monto: com.monto,
                      precio: com.precio,
                    })),
                  };
                } else {
                  return {
                    otros: {
                      id: detalle._id,
                      tipo: detalle.rubro,
                      descripcion: detalle.descripcion,
                    },
                    importe: detalle.importe,
                  };
                }
              }),
            );
            return {
              idVenta: venta.id_venta,
              descuento: venta.descuento,
              montoTotal: venta.montoTotal,
              precio: venta.precio,
              comisiona: venta.comisiona,
              tipo: venta.tipo,
              tipo2: venta.tipo2,
              nombrePromocion: venta.nombrePromocion,
              tipoDescuento: venta.tipoDescuento,
              descuentoPromocion: venta.descuentoPromocion,
              descuentoPromocion2: venta.descuentoPromocion2,
              detalle: detalleProcesado,
            };
          }),
        );

        ventaAsesor.ventas = ventasProcesadas;

        const { gafaVip, monturavip, lenteDeContacto } =
          this.monturasYgafasVip(ventaAsesor);
        ventaAsesor.gafaVip = gafaVip;
        ventaAsesor.monturaVip = monturavip;
        ventaAsesor.lenteDeContacto = lenteDeContacto;
        ventaAsesor.totalDescuento = ventaAsesor.ventas.reduce(
          (acc, item) => acc + item.descuento,
          0,
        );
        ventaAsesor.montoTotal = ventaAsesor.ventas.reduce(
          (acc, item) => acc + item.montoTotal,
          0,
        );

        return ventaAsesor;
      }),
    );

    return asesoresProcesados;
  }

  /*async listarVentas(buscadorVentaDto: BuscadorVentaDto) {
    const detalles = await this.DetalleVenta.aggregate([
      {
        $lookup: {
          from: 'Venta',
          foreignField: '_id',
          localField: 'venta',
          as: 'venta',
        },
      },
      { $unwind: { path: '$venta', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'venta.sucursal': {
            $in: buscadorVentaDto.sucursal.map(
              (item) => new Types.ObjectId(item),
            ),
          },
          'venta.fecha': {
            $gte: new Date(buscadorVentaDto.fechaInicio),
            $lte: new Date(buscadorVentaDto.fechaFin),
          },
          'venta.flag': flagVenta.finalizado,
        },
      },
      {
        $lookup: {
          from: 'Asesor',
          foreignField: '_id',
          localField: 'venta.asesor',
          as: 'asesor',
        },
      },
      {
        $unwind: { path: '$asesor', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'venta.sucursal',
          as: 'sucursal',
        },
      },
      {
        $unwind: { path: '$asesor', preserveNullAndEmptyArrays: false },
      },
      {
        $group: {
          _id: '$asesor._id',
          sucursal: { $first: '$sucursal.nombre' },
          asesor: { $first: '$asesor.nombre' },
          descuento: { $sum: '$venta.descuento' },
          importe: { $sum: '$importe' },
          montoTotal: { $sum: '$venta.montoTotal' },
          tickets:{$addToSet:'$producto'},
    
         
        },
      },

      {
        $project: {
         sucursal:1,
          asesor: 1,
          descuento: 1,
          importe: 1,
          montoTotal: 1,
          tickets: { $size: '$tickets' }, 
        },
      }
    ]);
    return detalles;
  }*/

  /* async ventaConSusComiones(
    asesor: Types.ObjectId,
    fechaInicio: string,
    fechaFin: string,
  ) {
    const dataAsesor =await  this.asesorService.asesorEmpresa(asesor)
   const metas=await   this.metasProductoVipService.listarMetasProductosVipPorSucursal(dataAsesor.sucursal)
    const ventas = await this.venta.aggregate([
      {
        $match: {
          asesor: new Types.ObjectId(asesor),
          fecha: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin),
          },
          flag: flagVenta.finalizado,
        },
      },
      {
        $lookup:{
          from:'Sucursal',
           foreignField:'_id',
           localField:'sucursal',
           as:'sucursal'
        }
      },
     
      {
        $project: {
          sucursal: { $arrayElemAt: ["$sucursal.nombre", 0]},
          id_venta: 1,
          montoTotal: 1,
          tipo: 1,
          tipo2: 1,
          tipoDescuento: 1,
          descuento: 1,
          precio: 1,
        },
      },
    ]);
   
    
    const data = await Promise.all(
      ventas.map(async (venta) => {
        const dataventa = {
          sucursal:venta.sucursal,
          id_venta: venta.id_venta,
          descuento: venta.descuento,
          detalle: [],
        };
        const detalles = await this.detalleVentaService.listarDetalleVenta(venta._id);
        const detalleConComisiones = await Promise.all(
          detalles.map(async (detalle) => {
            if (detalle.rubro === productoE.lente) {
              const comisiones = await this.comisionRecetaService.listarComisionReceta(
                venta.precio,
                detalle.combinacionReceta,
              );
              return {
                combinacion: {
                  descripcion: detalle.descripcion,
                  id: detalle.combinacionReceta,
                },
                importe: detalle.importe,
                comisiones: comisiones.map((com) => ({
                  id: com._id,
                  nombre: com.nombre,
                  monto: com.monto,
                  precio: com.precio,
                })),
              };
            } else if (
              detalle.rubro === productoE.montura ||
              detalle.rubro === productoE.lenteDeContacto ||
              detalle.rubro === productoE.gafa
            ) {
              const comisiones = await this.comisionProductoService.listarComosionPorProducto(
                detalle.producto,
                venta.precio,
              );
              return {
                producto: {
                  id: detalle._id,
                  tipo: detalle.rubro,
                  marca: detalle.marca,
                },
                importe: detalle.importe,
                comisiones: comisiones.map((com) => ({
                  id: com._id,
                  nombre: com.nombre,
                  monto: com.monto,
                  precio: com.precio,
                })),
              };
            } else {
              return {
                servicios: {
                  id: detalle._id,
                  tipo: detalle.rubro,
                },
                importe: detalle.importe,
              };
            }
          })
        );
  
        dataventa.detalle = detalleConComisiones;
        return dataventa;
      })
    );
    const { gafaVip, lenteDeContacto, monturavip } = this.monturasYgafasVip2(data);

    return {
      metaProductosVip:metas,
      empresa:dataAsesor.empresa,
      gafaVip,
      lenteDeContacto,
      monturavip,
      data,
     
    };
  }*/

  private monturasYgafasVip(venta: any) {
    let monturavip: number = 0;
    let gafaVip: number = 0;
    let lenteDeContacto: number = 0;

    for (const vent of venta.ventas) {
      if (Array.isArray(vent.detalle)) {
        for (const detalle of vent.detalle) {
          if (detalle.producto && detalle.producto.tipo == productoE.montura) {
            if (venta.sucursal == 'SUCRE  CENTRAL') {
              if (
                detalle.producto.marca == 'PRADA' ||
                detalle.producto.marca == 'GUCCI' ||
                detalle.producto.marca == 'TOM FORD' ||
                detalle.producto.marca == 'BURBERRY' ||
                detalle.producto.marca == 'ERMENEGILDO ZEGNA' ||
                detalle.producto.marca == 'FRED' ||
                detalle.producto.marca == 'LOEWE' ||
                detalle.producto.marca == 'PORSHE DESIGN' ||
                detalle.producto.marca == 'RINOWA' ||
                detalle.producto.marca == 'MONTBLANC' ||
                detalle.producto.marca == 'TIFFANY'
              ) {
                monturavip++;
              }
            } else if (
              detalle.producto &&
              detalle.producto.tipo == productoE.montura &&
              detalle.importe >= 700
            ) {
              monturavip++;
            }
          }

          if (detalle.producto && detalle.producto.tipo == productoE.gafa) {
            if (venta.sucursal == 'SUCRE  CENTRAL') {
              if (
                detalle.producto.marca == 'PRADA' ||
                detalle.producto.marca == 'GUCCI' ||
                detalle.producto.marca == 'TOM FORD' ||
                detalle.producto.marca == 'BURBERRY' ||
                detalle.producto.marca == 'ERMENEGILDO ZEGNA' ||
                detalle.producto.marca == 'FRED' ||
                detalle.producto.marca == 'LOEWE' ||
                detalle.producto.marca == 'PORSHE DESIGN' ||
                detalle.producto.marca == 'RINOWA' ||
                detalle.producto.marca == 'MONTBLANC' ||
                detalle.producto.marca == 'TIFFANY'
              ) {
                gafaVip++;
              }
            } else if (
              detalle.producto &&
              detalle.producto.tipo == productoE.gafa &&
              detalle.importe >= 700
            ) {
              gafaVip++;
            }
          }

          if (
            detalle.producto &&
            detalle.producto.tipo == productoE.lenteDeContacto
          ) {
            if (venta.sucursal == 'SUCRE  CENTRAL') {
              if (
                detalle.producto.marca == 'PRADA' ||
                detalle.producto.marca == 'GUCCI' ||
                detalle.producto.marca == 'TOM FORD' ||
                detalle.producto.marca == 'BURBERRY' ||
                detalle.producto.marca == 'ERMENEGILDO ZEGNA' ||
                detalle.producto.marca == 'FRED' ||
                detalle.producto.marca == 'LOEWE' ||
                detalle.producto.marca == 'PORSHE DESIGN' ||
                detalle.producto.marca == 'RINOWA' ||
                detalle.producto.marca == 'MONTBLANC' ||
                detalle.producto.marca == 'TIFFANY'
              ) {
                lenteDeContacto++;
              }
            } else if (
              detalle.producto &&
              detalle.producto.tipo == productoE.lenteDeContacto &&
              detalle.importe >= 700
            ) {
              lenteDeContacto++;
            }
          }
        }
      } else {
        console.log(vent);
      }
    }

    return { monturavip, gafaVip, lenteDeContacto };
  }

  private async listarVentasPorAsesor(
    asesor: Types.ObjectId,
    fechaInicio: string,
    fechaFin: string,
    tipoVenta: Types.ObjectId[],
  ) {
    const filter: FiltroI = {
      fechaFinalizacion: {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      },
      comisiona: true,
      flag: flagVenta.finalizado,
      asesor: new Types.ObjectId(asesor),
    };

    tipoVenta.length > 0
      ? (filter.tipoVenta = {
          $in: tipoVenta.map((item) => new Types.ObjectId(item)),
        })
      : filter;

    const ventas = await this.venta.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'DetalleVenta',
          foreignField: 'venta',
          localField: '_id',
          as: 'detalleVenta',
        },
      },
      {
        $project: {
          id_venta: 1,
          montoTotal: 1,
          tipo: 1,
          tipo2: 1,
          tipoDescuento: 1,
          descuento: 1,
          precio: 1,
          detalleVenta: 1,
        },
      },
    ]);
    return ventas;
  }

  async listarDetalleVentas(
    asesor: Types.ObjectId,
    fechaInicio: string,
    fechaFin: string,
    tipoVenta: Types.ObjectId[],
  ) {
    const detalle = await this.DetalleVenta.aggregate([
      {
        $lookup: {
          from: 'Venta',
          foreignField: '_id',
          localField: 'venta',
          as: 'venta',
        },
      },
      {
        $unwind: { path: '$venta', preserveNullAndEmptyArrays: false },
      },
      {
        $match: {
          'venta.asesor': new Types.ObjectId(asesor),
          'venta.fechaFinalizacion': {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin),
          },
          'venta.flag': flagVenta.finalizado,
        },
      },
    ]);
    return detalle;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }

  async guardarVenta(venta: VentaI) {
    const v = await this.venta.findOne({
      id_venta: venta.id_venta.toUpperCase(),
    });
    if (!v) {
      return await this.venta.create(venta);
    }
    return v;
  }

  async tieneReceta(id: Types.ObjectId, tieneRecereta: boolean) {
    const v = await this.venta.findOne({ _id: id });
    if (v) {
      return await this.venta.updateOne(
        { _id: id },
        { tieneReceta: tieneRecereta },
      );
    }
  }

  async tieneProducto(id: Types.ObjectId, tieneProducto: boolean) {
    const v = await this.venta.findOne({ _id: id });

    if (v) {
      return await this.venta.updateOne(
        { _id: id },
        { tieneProducto: tieneProducto },
      );
    }
  }

  async tipoPrecio(id: Types.ObjectId, precio: string) {
    const v = await this.venta.findOne({ _id: id });

    if (v) {
      return await this.venta.updateOne({ _id: id }, { precio: precio });
    }
  }
}
