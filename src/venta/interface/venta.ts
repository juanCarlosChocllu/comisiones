import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';
import { flagVenta } from '../enum/flagVenta';
import { LlavesI } from 'src/metas-producto-vip/interface/metasLLave';

export interface VentaI {
  id_venta?: string;

  montoTotal?: number;

  asesor?: Types.ObjectId;

  descuento?: number;

  comisiona?: boolean;

  sucursal?: Types.ObjectId;

  tieneReceta?: boolean;

  tieneProductos?: boolean;

  fechaVenta?: Date;

  tipoVenta?: Types.ObjectId;

  fechaFinalizacion?: Date;

  flag?: string;
   estado?: string;

  tipo?: string;

  tipo2?: string;

  nombrePromosion?: string;
  estadoTracking?:string
  tipoDescuento?: string;


  descuentoPromosion?: Number;

  descuentoPromosion2?: string;
  precioTotal?:number
  precio?:string
}


export interface Comision {
  id: Types.ObjectId;
  nombre: string;
  monto: number;
  precio:string
}

interface Combinacion {
  id: Types.ObjectId;
  descripcion: string;

}

interface Producto {
  id: Types.ObjectId;
  tipo: string;
  marca: string;
 
}

interface ServiciosI {
  id: Types.ObjectId;
  tipo: string;

}

export interface DetalleVenta {
  producto?: Producto;
  combinacion?: Combinacion;
  importe: number;
  comisiones?: Comision[];
  servicios?:ServiciosI

}

export interface VentaAsesor {
  idVenta: string;
  descuento: number;
  montoTotal: number;
  comisiona: boolean;
  tipo: string;
  tipo2: string;
  nombrePromocion: string;
  tipoDescuento: string | null;
  descuentoPromocion: number;
  descuentoPromocion2: number;
  detalle: DetalleVenta[];
}

export interface RegistroVentas {
  metaProductosVip: LlavesI;
  sucursal: string;
  idSucursal:Types.ObjectId
  empresa:string
  asesor: string;
  gestor:boolean
  totalDescuento:number
  montoTotal:number
  monturaVip:number,
  gafaVip:number,
  lenteDeContacto:number
  ventas: VentaAsesor[];
}


export interface FiltroI {
  asesor?: Types.ObjectId;
  flag: flagVenta | flag; 
  comisiona: boolean;
  tipoVenta?: {$in:Types.ObjectId[]};
  fechaFinalizacion: {
    $gte:  Date
    $lte: Date
  },
}

export interface FinalizarVentaI {
  fechaFinalizacion?:Date,
  flag: string,
  descuento: number,
  montoTotal: number
  precioTotal:number
}


export interface VentaRendimientoDiarioI {
  lente: number
  lc: number
  entregadas: number
  receta: Receum[]
  montoTotal: number
  asesorId: Types.ObjectId
  asesor: string
  fecha: string
  ticket:number
}

export interface Receum {
  descripcion: string
}

export interface resultadRendimientoDiarioI {
  metaTicket:number,
    diasComerciales:number,
  sucursal:string,
    metaMonto:number
  ventaAsesor:ventaAsesorI[]

}
export interface ventaAsesorI{
  asesor:string
  ventas:VentaRendimientoDiarioI[]
}

export interface avanceLocalI {
  sucursal:string,
  metaTicket:string
  metaMonto:string
  ventas:ventaAvanceLocalI[]

}

export interface ventaAvanceLocalI 

    {
      ventasRelizadas:number,
      ventasFinalizadas:number,
      fecha:string
      asesores:Types.ObjectId[]
    }
  