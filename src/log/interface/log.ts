import { Types } from 'mongoose';

export interface LogI {
  usuario?: Types.ObjectId;

  descripcion?: string;

  method: string;

  path: string;

  schema:string
}
