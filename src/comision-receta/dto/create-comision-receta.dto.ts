import { Type } from "class-transformer"
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator"
import { Types } from "mongoose"


export class CreateComisionRecetaDto {
@IsArray()
@ArrayMinSize(1)
@Type(()=>DataComisionRecetaDto)
@ValidateNested()
data:DataComisionRecetaDto[]
}

export class DataComisionRecetaDto {
        @IsString()
        @IsNotEmpty()
        nombre:string
    
        @IsNumber()
        @IsNotEmpty()
        monto:number

        @IsNumber()
        @IsNotEmpty()
        diferencia:number

        @IsNumber()
        @IsNotEmpty()
        comision:number

        @IsNotEmpty()
        @IsMongoId()
        precio:Types.ObjectId

        @IsNotEmpty()
        @IsBoolean()
        base:string
}


