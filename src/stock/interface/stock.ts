import { Types } from "mongoose";
import { StockMia } from "src/providers/interface/stockMia";

export interface StockI {

  cantidad: number;


  almacen?: Types.ObjectId;


  sucursal?: Types.ObjectId;


  producto: Types.ObjectId;


  tipo:string


  codigoMia:string
  
}
 
export interface StockProductoI {
    producto:Types.ObjectId,
    stock:StockMia[]
}