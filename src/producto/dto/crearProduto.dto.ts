import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

export class CrearProductoDto {
    @IsString()
     @IsNotEmpty()
     codigoMia: string;


     @IsString()
     @IsNotEmpty()
     tipoProducto: string;

     @IsString()
     @IsNotEmpty()
     marca: string;

     @IsString()
     @IsOptional()
     serie: string;

     @IsString()
     @IsNotEmpty()
     color: string;
     
     @IsString()    
     @IsOptional()
     tipoMontura: string;

    
     @IsString()
     @IsOptional()
     codigoQR: string;
    
     @IsArray()
     precios: [
       {
         tipoPrecio: string;
   
         precio: number;
       },
     ];

}