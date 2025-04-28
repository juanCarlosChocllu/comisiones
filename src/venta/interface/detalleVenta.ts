import { Types } from "mongoose";

export interface detalleVentaI{

      venta: Types.ObjectId;

      combinacionReceta?: Types.ObjectId;
    
      importe: number;
    
      cantidad: number;
    
      producto?: Types.ObjectId;
    
      rubro: string;

      descripcion?:string

      marca?:string

 

      
}