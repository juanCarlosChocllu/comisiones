import { Types } from 'mongoose';

export interface LlavesI {
  montura: number;

  precioMontura: number;

  gafa: number;

  precioGafa: number;

  marcaMonturas: string[];

  marcaGafas: string[];

  lenteDeContacto: number;

  sucursal: Types.ObjectId;
}
