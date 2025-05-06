import { Transform } from "class-transformer"
import { IsOptional, IsString } from "class-validator"
import { PaginadorDto } from "src/core/dto/paginadorDto"

export class BuscadorCombinacionDto extends PaginadorDto{
                 @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                material:string
            
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                tipoLente:string
                
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                rango:string
            
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                colorLente:string
            
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                marcaLente:string
            
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                tratamiento:string
    
                @IsString()
                @IsOptional()
                @Transform(({value}:{value:string})=> value.toUpperCase().trim())
                tipoColorLente:string
}