import { IsOptional, IsString } from "class-validator";
import { PaginadorDto } from "src/core/dto/paginadorDto";

export class BuscadorMarcaDto extends PaginadorDto{
    @IsOptional()
    @IsString()
    nombre:string
}