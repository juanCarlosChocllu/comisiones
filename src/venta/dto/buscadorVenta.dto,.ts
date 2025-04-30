import { IsArray, IsDateString, IsMongoId, isMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { Types } from "mongoose";

export class BuscadorVentaDto {
    @IsArray()
    @IsMongoId({each:true})
    sucursal:Types.ObjectId[]

    @IsArray()
    @IsMongoId({each:true})
    @IsOptional()
    tipoVenta:Types.ObjectId[] = []

    @IsDateString()
    @IsNotEmpty()
    fechaInicio:string

    @IsDateString()
    @IsNotEmpty()
    fechaFin:string

}