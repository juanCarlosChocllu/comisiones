import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
import { from } from 'form-data';
import { formaterFechaHora } from 'src/core/utils/formaterFechaHora';
import { FinalizarVentaDto } from '../dto/FinalizarVentaDto';
import { key } from 'src/core/config/config';
import { LlavesI } from 'src/metas-producto-vip/interface/metasLLave';

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
          sucursal: asesor.sucursalNombre,
          idSucursal:asesor.idSucursal,
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
                      tipo: detalle.rubro,
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
                      id: detalle.producto,
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
              fechaFinalizacion: venta.fechaFinalizacion,
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
          this.monturasYgafasVip(ventaAsesor,llaves);
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

  private monturasYgafasVip(venta: RegistroVentas, llave:LlavesI) {
    let monturavip: number = 0;
    let gafaVip: number = 0;
    let lenteDeContacto: number = 0;

    for (const vent of venta.ventas) {
      if (Array.isArray(vent.detalle)) {
        for (const detalle of vent.detalle) {
          if (detalle.producto && detalle.producto.tipo == productoE.montura) {
              if(llave && llave.marcaMonturas.length > 0){
                  for (const marca of llave.marcaMonturas) {
                      if(detalle.producto.marca === marca){
                        monturavip ++
                       }
                  }
              }else{
                if(llave && detalle.importe >= llave.precioMontura){
                   monturavip ++
                }
              }   
          }
          if (detalle.producto && detalle.producto.tipo == productoE.gafa) {
             if(llave && llave.marcaGafas.length > 0){
                  for (const marca of llave.marcaGafas) {
                      if(detalle.producto.marca === marca){
                        gafaVip ++
                       }  
                  }
              }else{
                if(llave && detalle.importe >= llave.precioGafa){
                   gafaVip ++
                }
              }
          }
          if (
            detalle.producto &&
            detalle.producto.tipo == productoE.lenteDeContacto
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

  async finalizarVentas(finalizarVentaDto: FinalizarVentaDto) {
    try {
      if (finalizarVentaDto.key != key) {
        throw new UnauthorizedException();
      }
      const venta = await this.venta.findOne({
        id_venta: finalizarVentaDto.idVenta.toUpperCase().trim(),
      });
      if (venta) {
        await this.venta.updateMany(
          { id_venta: finalizarVentaDto.idVenta.toUpperCase().trim() },
          {
            fechaFinalizacion: new Date(finalizarVentaDto.fecha),
            flag: finalizarVentaDto.flag,
          },
        );
        return { status: HttpStatus.OK };
      }
      return { status: HttpStatus.NOT_FOUND };
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
