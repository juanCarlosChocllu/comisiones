import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { Types } from "mongoose"

export class CreateZonaDto {
    @IsNotEmpty()
    @IsString()
    nombre:string

    @IsMongoId({each:true})
    @IsArray()
    @ArrayMinSize(1)
    sucursales:Types.ObjectId[]
}



