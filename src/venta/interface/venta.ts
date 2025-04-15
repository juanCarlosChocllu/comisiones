import { PartialType } from "@nestjs/mapped-types"
import { Types } from "mongoose"

export interface VentaI{
     
        id_venta:string
        
        montoTotal:number
    
        asesor:Types.ObjectId
            
        descuento:number
 
        comisiona:boolean
    
        sucursal:Types.ObjectId
}


export type VentagGuardar = Partial<VentaI>;