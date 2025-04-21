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
  montura: number;
  gafa: number;
  lenteDeContacto: number;
  sucursal: Types.ObjectId;

}

interface Comision {
  id: string;
  nombre: string;
  monto: number;
}

interface Combinacion {
  id: string;
  material: string;
  tipoLente: string;
  rango: string;
  colorLente: string;
  marcaLente: string;
  tratamiento: string;
  tipoColorLente: string;
}

interface Producto {
  id: string;
  tipo: string;
  marca: string;
  categoria: string;
}

interface DetalleVenta {
  producto?: Producto;
  combinacion?: Combinacion;
  importe: number;
  comisiones: Comision[];
}

interface Venta {
  idVenta: string;
  descuento: number;
  montoTotal: number;
  comisiona: boolean;
  tipo: string;
  tipo2: string;
  nombrePromosion: string;
  tipoDescuento: string | null;
  descuentoPromosion: number;
  descuentoPromosion2: number;
  detalle: DetalleVenta[];
}

export interface RegistroVentas {
  metaProductosVip: MetaProductosVip;
  sucursal: string;
  asesor: string;
  ventas: Venta[];
}