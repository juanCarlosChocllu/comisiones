import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Venta } from '../schema/venta.schema';
import { Model, Types } from 'mongoose';
import { RegistroVentas, VentaAsesor, VentaI } from '../interface/venta';
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
import { DetalleVenta } from './../interface/venta';
import { lstat } from 'fs';
import { PreciosService } from 'src/precios/service/precios.service';
@Injectable()
export class VentaService {
  constructor(
    @InjectModel(Venta.name) private readonly venta: Model<Venta>,
    private readonly asesorService: AsesorService,
    private readonly detalleVentaService: DetalleVentaService,
    private combinacionRecetaService: CombinacionRecetaService,
    private comisionRecetaService: ComisionRecetaService,
    private productoService: ProductoService,
    private comisionProductoService: ComisionProductoService,
    private metasProductoVipService: MetasProductoVipService,
    private preciosService: PreciosService,
  ) {}
  create(createVentaDto: CreateVentaDto) {
    return 'This action adds a new venta';
  }

  async listarVentas() {
    const asesores = await this.asesorService.listarAsesor();
    const data: RegistroVentas[] = [];
    let contador = 0;
    for (const asesor of asesores) {
      contador++;
      const metas =
        await this.metasProductoVipService.listarMetasProductosVipPorSucursal(
          asesor.idSucursal,
        );

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

      const ventas = await this.venta.find({ asesor: asesor._id });
      for (const venta of ventas) {
        const detalles = await this.detalleVentaService.listarDetalleVenta(
          venta._id,
        );

        const ventaData: VentaAsesor = {
          idVenta: venta.id_venta,

          descuento: venta.descuento,
          montoTotal: venta.montoTotal,
          comisiona: venta.comisiona,
          tipo: venta.tipo,
          tipo2: venta.tipo2,
          nombrePromocion: venta.nombrePromocion,
          tipoDescuento: venta.tipoDescuento,
          descuentoPromocion: venta.descuentoPromocion,
          descuentoPromocion2: venta.descuentoPromocion2,

          detalle: [],
        };

        for (const detalle of detalles) {
          if (detalle.rubro === productoE.lente) {
            const combinacion =
              await this.combinacionRecetaService.listarCombinacionPorVenta(
                detalle.combinacionReceta,
              );
            
             
            const comisiones =
              await this.comisionRecetaService.listarComisionReceta(
                venta.precio,
                combinacion._id
              );

            const ventaCombinacion: DetalleVenta = {
              combinacion: {
                id: combinacion._id,
                material: combinacion.material,
                tipoLente: combinacion.tipoLente,
                rango: combinacion.rango,
                colorLente: combinacion.colorLente,
                marcaLente: combinacion.marcaLente,
                tratamiento: combinacion.tratamiento,
                tipoColorLente: combinacion.tipoColorLente,
              },
              importe: detalle.importe,
              comisiones: comisiones.map((com) => ({
                id: com._id,
                nombre: com.nombre,
                monto: com.monto,
                precio: com.precio,
              })),
            };

            ventaData.detalle.push(ventaCombinacion);
          } else {
            if (
              detalle.rubro === productoE.montura ||
              detalle.rubro === productoE.lenteDeContacto ||
              detalle.rubro === productoE.gafa
            ) {
              const producto =
                await this.productoService.verificarProductoventa(
                  detalle.producto,
                );
            
              const comisiones =
                await this.comisionProductoService.listarComosionPorProducto(
                  producto._id,
                );

              const ventaProducto = {
                producto: {
                  id: producto._id,
                  tipo: producto.tipoProducto,
                  marca: producto.marca,
                  categoria: producto.categoria,
                },
                importe: detalle.importe,
                comisiones: comisiones.map((com) => ({
                  id: com._id,
                  nombre: com.nombre,
                  monto: com.monto,
                  precio: 'falta',
                })),
              };

              ventaData.detalle.push(ventaProducto);
            }else {
              const servicios = {
                servicios: {
                  id: detalle._id,
                  tipo: detalle.rubro,     
                },
                importe: detalle.importe
            }
            ventaData.detalle.push(servicios);
            }
          }
        }
        ventaAsesor.ventas.push(ventaData);
      }
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
      data.push(ventaAsesor);
    }
    console.log(contador);

    return data;
  }

  private monturasYgafasVip(venta: RegistroVentas) {
    let monturavip: number = 0;
    let gafaVip: number = 0;
    let lenteDeContacto: number = 0;
    //console.log(venta.sucursal);

    for (const vent of venta.ventas) {
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
    }

    return { monturavip, gafaVip, lenteDeContacto };
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
}
