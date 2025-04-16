import { IsArray, ValidateNested } from "class-validator";
import { dataProductoDto } from "./dataProducto.dto";
import { Type } from "class-transformer";

export class CreateProductoDto {

    @IsArray()
    @Type(()=>dataProductoDto )
    @ValidateNested({each:true})
    data:dataProductoDto[]
}
