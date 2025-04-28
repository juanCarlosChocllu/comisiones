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
import { BuscadorVentaDto } from '../dto/buscadorVenta.dto,';
import { flagVenta } from '../enum/flagVenta';
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

  async listarVentas(buscadorVentaDto: BuscadorVentaDto) {
    const data: RegistroVentas[] = []
  
    for (const sucursal of buscadorVentaDto.sucursal) {      
      const ventasAgrupadas = await this.venta.aggregate([
        {
          $match: {
            sucursal: new Types.ObjectId(sucursal),
            flag: flagVenta.finalizado,
            comisiona: true,
            tipoVenta: {
              $in: [
                new Types.ObjectId('680cf0e721a6f4ae4df636e7'),
                new Types.ObjectId('680cf0a921a6f4ae4df591f7')
              ]
            },
            fechaFinalizacion: {
              $gte: new Date(buscadorVentaDto.fechaInicio),
              $lte: new Date(buscadorVentaDto.fechaFin),
            }
          }
        },
        {
          $lookup: {
            from: 'Asesor',
            localField: 'asesor',
            foreignField: '_id',
            as: 'asesor'
          }
        },
        {
          $unwind: {
            path: '$asesor',
            preserveNullAndEmptyArrays: false
          }
        },

        {
          $lookup: {
            from: 'Sucursal',
            localField: 'asesor.sucursal',
            foreignField: '_id',
            as: 'sucursal'
          }
        },
        {
          $unwind: {
            path: '$sucursal',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $lookup: {
            from: 'Empresa',
            localField: 'sucursal.empresa',
            foreignField: '_id',
            as: 'empresa'
          }
        },
        {
          $unwind: {
            path: '$empresa',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $group: {
            _id: '$asesor._id',
            asesor: { $first: '$asesor.nombre' },
            sucursal: { $first: '$sucursal.nombre' },
            empresa: { $first: '$empresa.nombre' },
            totalVentas: { $sum: 1 }, 
            montoTotalVentas: { $sum: '$montoTotal' } ,
            ventas: {
              $push: {
                _id:'$_id',
                idVenta: '$id_venta',
                descuento: '$descuento',
                montoTotal: '$montoTotal',
                comisiona: '$comisiona',
                tipo: '$tipo',
                tipo2: '$tipo2',
                nombrePromocion: '$nombrePromocion',
                tipoDescuento: '$tipoDescuento',
                descuentoPromocion: '$descuentoPromocion',
                descuentoPromocion2: '$descuentoPromocion2',
                fechaFinalizacion: '$fechaFinalizacion',
                    precio: '$precio'
              }
            },
    
          }
        }
      ]);
      

        for (const ventas of ventasAgrupadas) {
          
          
              for (const venta of ventas.ventas) {
                venta.detalle = []
                const detalles = await this.detalleVentaService.listarDetalleVenta(venta._id);
                for (const detalle of  detalles) {
                  if (detalle.rubro === productoE.lente) {
                    const comisiones =await  this.comisionRecetaService.listarComisionReceta(venta.precio, detalle.combinacionReceta)
          
        
                    const data= {
                      combinacion: {
                        id: detalle.combinacionReceta,
                        descripcion:detalle.descripcion
                       
                      },
                      importe: detalle.importe,
                      comisiones: comisiones.map((com) => ({
                        id: com._id,
                        nombre: com.nombre,
                        monto: com.monto,
                        precio: com.precio,
                      })),
                    };
                    venta.detalle.push(data)
                    
                  }else if (
                    detalle.rubro === productoE.montura ||
                    detalle.rubro === productoE.lenteDeContacto ||
                    detalle.rubro === productoE.gafa
                    ) {
                    const comisiones = await this.comisionProductoService.listarComosionPorProducto(detalle.producto, venta.precio)
               
        
                    const data= {
                      producto: {
                        id: detalle.producto,
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
                    venta.detalle.push(data)
                    
                  }else {
                    const data = {
                      servicios: {
                        id: detalle._id,
                        tipo: detalle.rubro,
                      },
                      importe: detalle.importe,
                    };
                    venta.detalle.push(data)
                    
                  }
                  
                }
              
                
              }
              const {gafaVip,lenteDeContacto,monturavip}=  this.monturasYgafasVip(ventas)
              ventas.gafaVip = gafaVip,
              ventas.lenteDeContacto =lenteDeContacto
              ventas.monturaVip =monturavip
            
              data.push(...ventasAgrupadas)   
        }

      
    }
    
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
