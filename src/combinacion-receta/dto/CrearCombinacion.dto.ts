import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator"

export class CrearCombinacionDto{
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
            importe:number

            @IsString()
            @IsNotEmpty()
            @Transform(({value}:{value:string})=> value.toUpperCase())
            tipoPrecio:string

            @IsString()
            @IsNotEmpty()
            @IsUUID("4",{message:'Formato invalido'} )
            key:string

            @IsNumber()
            @IsNotEmpty()
            @Min(0)
            comision1:number

            
            @IsNumber()
            @IsNotEmpty()
            @Min(0)
            comision2:number

        
           /* @IsString()
            @IsNotEmpty()
            codigoMia:string*/
}