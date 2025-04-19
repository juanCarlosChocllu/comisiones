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
}
