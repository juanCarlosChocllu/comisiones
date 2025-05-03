import { Types } from "mongoose";
import { comisionesI } from "src/combinacion-receta/interface/combinacionReceta";

export interface DataProductoI {
   codigoMia?:string
    tipoProducto: string;
    marca: Types.ObjectId;       
    color?: Types.ObjectId;        
    serie: string;
    categoria?: string;
    codigoQR?: string;
    estuchePropio?: boolean;
    tipoMontura?:Types.ObjectId
    comision?:boolean
  }


  
  export interface productosExcelI {
   codigoMia?:string
     tipoProducto: string;
     marca: string;       
     color: string;        
     serie: string;
     categoria: string;
     codigoQR: string;
     precio: string;
      comisiones?:comisionesI[],
      tipoMontura:string
   }
 