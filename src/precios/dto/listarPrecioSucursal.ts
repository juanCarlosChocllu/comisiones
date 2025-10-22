import { ArrayMinSize,  IsArray } from "class-validator";
import { Types } from "mongoose";

export class ListarPrecioSucursalDto {
    @IsArray()
    @ArrayMinSize(1, { message: 'Debe haber al menos una sucursal.' })
    sucursal:Types.ObjectId[]
}