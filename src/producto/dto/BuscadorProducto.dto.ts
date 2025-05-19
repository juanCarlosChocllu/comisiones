
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

export class BuscadorProductoDto extends PaginadorDto {
  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.toUpperCase().trim())
  marca: string;
  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.trim())
  serie: string;
  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.toUpperCase().trim())
  codigoQr: string;
  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.toUpperCase().trim()) 
  color: string;

  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.toUpperCase().trim())
  tipoProducto: string;

  @IsString()
  @IsOptional()
  @Transform(({value}:{value:string})=> value.toUpperCase().trim())
  categoria: string;
}
