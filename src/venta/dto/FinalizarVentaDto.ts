import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator"

export class FinalizarVentaDto {
    
    @IsString()
    @IsNotEmpty()
    idVenta:string


    @IsString()
    @IsNotEmpty()
    flag:string


    @IsDateString()
    @IsNotEmpty()
    fecha:string

    @IsUUID()
    @IsNotEmpty()
    key:string
}