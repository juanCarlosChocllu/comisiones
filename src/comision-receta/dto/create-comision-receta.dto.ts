import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Types } from "mongoose"
import { tipoComisionE } from "src/core/enum/tipoComision"

export class CreateComisionRecetaDto {
        @IsString()
        @IsNotEmpty()
        nombre:string
    
        @IsNumber()
        @IsNotEmpty()
        monto:number

        @IsNotEmpty()
        @IsMongoId()
        combinacionReceta:Types.ObjectId

        @IsNotEmpty()
        @IsEnum(tipoComisionE)
        tipoComision:string
}
