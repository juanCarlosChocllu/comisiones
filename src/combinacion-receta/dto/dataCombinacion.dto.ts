import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class DataCombiancionDto{
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            material:string
        
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            tipoLente:string
            
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            rango:string
        
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            colorLente:string
        
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            marcaLente:string
        
            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            tratamiento:string

            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            tipoColorLente:string

            @IsNumber()
            @IsNotEmpty()
            monto:number

            @IsString()
            @IsNotEmpty()
            tipoPrecio:string


            @IsString()
            @IsNotEmpty()
            codigoMia:string
}