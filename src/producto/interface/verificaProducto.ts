import { Types } from "mongoose"

export interface verificarProductoI {
        _id:Types.ObjectId
        tipoProducto:string,
        marca:string
        categoria:1
      
}