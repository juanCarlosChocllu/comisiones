import { PartialType } from '@nestjs/mapped-types';
import { Types } from 'mongoose';

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

  tipo?: string;

  tipo2?: string;

  nombrePromosion?: string;

  tipoDescuento?: string;

  descuentoPromosion?: Number;

  descuentoPromosion2?: string;

  precio?:string
}
interface MetaProductosVip {
  _id: Types.ObjectId;
  monturaMasGafa: number;
  lenteDeContacto: number;
  sucursal: Types.ObjectId;

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
  metaProductosVip: MetaProductosVip;
  sucursal: string;
  empresa:string
  asesor: string;
  totalDescuento:number
  montoTotal:number
  monturaVip:number,
  gafaVip:number,
  lenteDeContacto:number
  ventas: VentaAsesor[];
}