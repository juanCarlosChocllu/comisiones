import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Types } from "mongoose"


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
        @IsBoolean()
        base:string
}
