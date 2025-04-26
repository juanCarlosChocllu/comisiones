import { IsArray, IsDateString, IsMongoId, isMongoId, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";

export class BuscadorVentaDto {
    @IsArray()
    @IsMongoId({each:true})
    sucursal:Types.ObjectId[]

    @IsDateString()
    @IsNotEmpty()
    fechaInicio:string

    @IsDateString()
    @IsNotEmpty()
    fechaFin:string

}