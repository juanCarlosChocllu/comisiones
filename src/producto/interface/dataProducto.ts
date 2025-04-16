import { Types } from "mongoose";

export interface DataProductoI {
    tipoProducto: string;
    marca: Types.ObjectId;       
    color: Types.ObjectId;        
    serie: string;
    categoria: string;
    codigoQR: string;
    estuchePropio: boolean;
    tipoMontura?:Types.ObjectId
  }