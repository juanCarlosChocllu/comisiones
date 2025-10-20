import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { DetalleVenta, Venta } from '../schema/venta.schema';
import { Model, Types } from 'mongoose';
import {
  FiltroI,
  FinalizarVentaI,
  RegistroVentas,
  VentaI,
} from '../interface/venta';
import { AsesorService } from 'src/asesor/asesor.service';

import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { productoE } from 'src/providers/enum/productos';

import { ComisionRecetaService } from 'src/comision-receta/comision-receta.service';

import { ComisionProductoService } from 'src/comision-producto/comision-producto.service';
import { MetasProductoVipService } from 'src/metas-producto-vip/metas-producto-vip.service';

import { BuscadorVentaDto } from '../dto/buscadorVenta.dto,';
import { flagVenta } from '../enum/flagVenta';
import { ComisionServicioService } from 'src/comision-servicio/comision-servicio.service';

import { formaterFechaHora } from 'src/core/utils/formaterFechaHora';
import { FinalizarVentaDto } from '../dto/FinalizarVentaDto';
import { key } from 'src/core/config/config';
import { LlavesI } from 'src/metas-producto-vip/interface/metasLLave';
import { detalleVentaI } from '../interface/detalleVenta';

import { AnularVentaDto } from '../dto/AnularVenta.dto';
import { horaUtc } from 'src/core/utils/horaUtc';
import { FinalizarVentaMia, VentaApiI } from 'src/providers/interface/venta';
import { RangoFecha } from '../dto/RangoFecha.dto';
import { RangoComisionProducto } from 'src/rango-comision-producto/schema/rangoComisionProducto.schema';
import { RangoComisionProductoService } from 'src/rango-comision-producto/rango-comision-producto.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectModel(Venta.name) private readonly venta: Model<Venta>,
    @InjectModel(DetalleVenta.name)
    private readonly detalleVenta: Model<DetalleVenta>,
    private readonly asesorService: AsesorService,
    private readonly comisionRecetaService: ComisionRecetaService,
    private readonly comisionProductoService: ComisionProductoService,
    private readonly metasProductoVipService: MetasProductoVipService,
    private readonly comisionServicioService: ComisionServicioService,
    private readonly rangoComisionProductoService: RangoComisionProductoService,
  ) {}

  async listasVentasComisiones(buscadorVentaDto: BuscadorVentaDto) {
    const asesores = await this.asesorService.listarAsesor(
      buscadorVentaDto.sucursal,
    );
    const asesoresProcesados = await Promise.all(
      asesores.map(async (asesor) => {
        const [llaves, ventas] = await Promise.all([
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
          metaProductosVip: llaves,
          gestor: asesor.gestor ? asesor.gestor : false,
          sucursal: asesor.sucursalNombre,
          idSucursal: asesor.idSucursal,
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
              venta.detalleVenta.map(async (detalle: detalleVentaI) => {
                if (detalle.rubro === productoE.lente) {
                  const comisiones =
                    await this.comisionRecetaService.listarComisionReceta(
                      venta.precio,
                      detalle.combinacionReceta,
                    );

                  return {
                    combinacion: {
                      medioPar: detalle.medioPar,
                      descripcion: detalle.descripcion,
                      id: detalle.combinacionReceta,
                      tipo: detalle.rubro,
                    },
                    importe: detalle.importe,
                    comisiones: comisiones.map((com) => {
                      if (detalle.medioPar === true) {
                        return {
                          monto: com.monto / 2,
                          precio: com.precio,
                        };
                      } else {
                        return {
                          monto: com.monto,
                          precio: com.precio,
                        };
                      }
                    }),
                  };
                } else if (
                  detalle.rubro === productoE.montura ||
                  detalle.rubro === productoE.lenteDeContacto ||
                  detalle.rubro === productoE.gafa
                ) {
                /*  const comisiones =
                    await this.comisionProductoService.listarComosionPorProducto(
                      detalle.producto,
                      venta.precio,
                    );*/
                     const comisiones =
                  await this.rangoComisionProductoService.buscarComisionProductoPorRango(venta.precio, detalle.importe)

                  return {
                    producto: {
                      id: detalle.producto,
                      tipo: detalle.rubro,
                      marca: detalle.marca,
                      descripcion: detalle.descripcion,
                    },
                    importe: detalle.importe,
                    comisiones: comisiones,
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
                    comisiones: comisiones,
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
              fechaFinalizacion: venta.fechaFinalizacion,
              idVenta: venta.id_venta,
              descuento: venta.precioTotal - venta.montoTotal,
              montoTotal: venta.montoTotal,
              precioTotal: venta.precioTotal ? venta.precioTotal : 0,
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

        const { gafaVip, monturavip, lenteDeContacto } = this.monturasYgafasVip(
          ventaAsesor,
          llaves,
        );
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

    return asesoresProcesados.filter((item) => item.ventas.length > 0);
  }

  private monturasYgafasVip(venta: RegistroVentas, llave: LlavesI) {
    let monturavip: number = 0;
    let gafaVip: number = 0;
    let lenteDeContacto: number = 0;

    for (const vent of venta.ventas) {
      if (Array.isArray(vent.detalle)) {
        for (const detalle of vent.detalle) {
          if (detalle.producto && detalle.producto.tipo == productoE.montura) {
            if (llave && llave.marcaMonturas.length > 0) {
              for (const marca of llave.marcaMonturas) {
                if (detalle.producto.marca === marca) {
                  monturavip++;
                }
              }
            } else {
              if (llave && llave.precioMontura >= detalle.importe) {
                monturavip++;
              }
            }
          }
          if (detalle.producto && detalle.producto.tipo == productoE.gafa) {
            if (llave && llave.marcaGafas.length > 0) {
              for (const marca of llave.marcaGafas) {
                if (detalle.producto.marca === marca) {
                  gafaVip++;
                }
              }
            } else {
              if (llave && llave.precioGafa >= detalle.importe) {
                gafaVip++;
              }
            }
          }
          if (
            detalle.producto &&
            detalle.producto.tipo === productoE.lenteDeContacto
          ) {
            lenteDeContacto++;
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
    const { f1, f2 } = formaterFechaHora(fechaInicio, fechaFin);
    const filter: FiltroI = {
      fechaFinalizacion: {
        $gte: f1,
        $lte: f2,
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
          nombrePromocion: 1,
          descuentoPromocion2: 1,
          descuentoPromocion: 1,
          precio: 1,
          comisiona: 1,
          detalleVenta: 1,
          fechaFinalizacion: 1,
          precioTotal: 1,
        },
      },
    ]);
    return ventas;
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

  async finalizarVentasCron(FinalizarVentaMia: FinalizarVentaMia) {
    const venta = await this.venta.findOne({
      id_venta: FinalizarVentaMia.id_venta,
    });
    if (venta) {
      await this.venta.updateOne(
        { id_venta: FinalizarVentaMia.id_venta.toUpperCase().trim() },
        {
          fechaFinalizacion: horaUtc(FinalizarVentaMia.fecha_finalizacion),
          estadoTracking: FinalizarVentaMia.estadoTracking,
          flag: FinalizarVentaMia.flaVenta,
          estado: FinalizarVentaMia.estado,
        },
      );
    } else {
      console.log('Ventas no encontradas', FinalizarVentaMia.id_venta);
    }
  }

  async finalizarVentas(finalizarVentaDto: FinalizarVentaDto) {
    try {
      if (finalizarVentaDto.key != key) {
        throw new UnauthorizedException();
      }
      const venta = await this.venta.findOne({
        id_venta: finalizarVentaDto.idVenta.toUpperCase().trim(),
      });
      if (venta) {
        await this.venta.updateOne(
          { id_venta: finalizarVentaDto.idVenta.toUpperCase().trim() },
          {
            fechaFinalizacion: new Date(finalizarVentaDto.fecha),
            flag: finalizarVentaDto.flag,
            descuento: finalizarVentaDto.descuento,
            montoTotal: finalizarVentaDto.montoTotal,
          },
        );
        return { status: HttpStatus.OK };
      }
      return { status: HttpStatus.NOT_FOUND };
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async actulizarDescuento(ventaMia: VentaApiI) {
    const venta = await this.venta.findOne({
      id_venta: ventaMia.idVenta.toUpperCase().trim(),
    });
    if (venta) {
      const data: FinalizarVentaI = {
        descuento: ventaMia.descuentoFicha,
        montoTotal: ventaMia.monto_total,
        precioTotal: ventaMia.precioTotal,
        flag: ventaMia.flag,
      };
      if (ventaMia.fecha_finalizacion) {
        data.fechaFinalizacion = new Date(ventaMia.fecha_finalizacion);
      }
      await this.venta.updateOne({ id_venta: ventaMia.idVenta }, data);
      if (ventaMia.rubro === productoE.lente) {
        const detalle = await this.detalleVenta.findOne({
          venta: venta._id,
          rubro: ventaMia.rubro,
          importe: 0,
        });
        if (detalle) {
          await this.detalleVenta.updateOne(
            { _id: detalle._id },
            { importe: ventaMia.importe },
          );
        }
      }

      if (ventaMia.rubro === productoE.montura) {
        const detalle = await this.detalleVenta.findOne({
          venta: venta._id,
          rubro: ventaMia.rubro,
          importe: 0,
        });
        if (detalle) {
          await this.detalleVenta.updateOne(
            { _id: detalle._id },
            { importe: ventaMia.importe },
          );
        }
      }
      if (ventaMia.rubro === productoE.gafa) {
        const detalle = await this.detalleVenta.findOne({
          venta: venta._id,
          rubro: ventaMia.rubro,
          importe: 0,
        });
        if (detalle) {
          await this.detalleVenta.updateOne(
            { _id: detalle._id },
            { importe: ventaMia.importe },
          );
        }
      }
    }
  }

  async anularVenta(anularVentaDto: AnularVentaDto) {
    const venta = await this.venta.findOne({
      id_venta: anularVentaDto.idVenta,
    });
    if (venta) {
      await this.venta.updateOne(
        { id_venta: anularVentaDto.idVenta },
        {
          fechaAnulacion: horaUtc(anularVentaDto.fechaAnulacion),
          estadoTracking: anularVentaDto.estadoTracking,
          estado: anularVentaDto.estado,
        },
      );
      return { status: HttpStatus.OK };
    }
  }

  async buscarVenta(id_venta: string): Promise<detalleVentaI[]> {
    const venta = await this.venta.findOne({ id_venta: id_venta });
    if (venta) {
      return this.detalleVenta.find({ venta: venta._id });
    }
  }

  async ventasInvalidas(rangoFecha: RangoFecha) {
    const ventas = await this.venta.aggregate([
      {
        $match: {
          $expr: { $gt: ['$montoTotal', '$precioTotal'] },
          estadoTracking: { $ne: 'ANULADO' },
          fechaVenta: {
            $gte: rangoFecha.fechaInicio,
            $lte: rangoFecha.fechaFin,
          },
        },
      },

      {
        $lookup: {
          from: 'Sucursal',
          foreignField: '_id',
          localField: 'sucursal',
          as: 'sucursal',
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
        $project: {
          id_venta: 1,
          montoTotal: 1,
          precioTotal: 1,
          asesor: { $arrayElemAt: ['$asesor.nombre', 0] },
          sucursal: { $arrayElemAt: ['$sucursal.nombre', 0] },
          fechaVenta: 1,
          fechaFinalizacion: 1,
        },
      },
      {
        $sort: { fechaVenta: -1 },
      },
    ]);

    return ventas;
  }
}
