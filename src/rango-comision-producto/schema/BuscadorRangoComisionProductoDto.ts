import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

export class BuscadorRangoComisionProductoDto extends PaginadorDto{
  @IsOptional()
  @IsString()
  nombre: string;


  @IsOptional()
  @IsNumber()
  @Transform((v)=>{
    return Number(v.value)
  })
  precioMinimo: number;

   @IsOptional()
  @IsNumber()
  @Transform((v)=>{
    return Number(v.value)
  })
  precioMaximo: number;
  @IsOptional()
  @IsString()
  @Transform(({value}:{value:string})=>{
    return value.toUpperCase().trim()
  })
  precio: string;
}
