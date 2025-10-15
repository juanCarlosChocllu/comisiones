import { Types } from 'mongoose';

export interface LogI {
  usuario?: Types.ObjectId;

  descripcion?: string;

  method: string;

  path: string;

  schema:string

  navegador:string
  
  ip:string
}


export interface LogActividadI {

  usuario: Types.ObjectId;

 
  accion: string;


  descripcion: string;

  ip: string;

  navegador: string;

  method: string;

  path: string;

  schema: string;
  body?:string
}