import { Types } from 'mongoose';

export interface detalleVentaI {

  _id?:Types.ObjectId
  
  
  venta: Types.ObjectId;

  combinacionReceta?: Types.ObjectId;

  servicio?: Types.ObjectId;

  importe: number;

  cantidad: number;

  producto?: Types.ObjectId;

  rubro: string;

  descripcion?: string;

  marca?: string;

  medioPar?: boolean;

 
}
