import { Types } from "mongoose";

export interface ScursalAsesorI {
    _id:Types.ObjectId,
    nombre:string,
    sucursalNombre:string,
    idSucursal:Types.ObjectId,
    empresa:string
    gestor:boolean
}

