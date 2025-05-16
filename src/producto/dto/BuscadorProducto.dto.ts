import { IsOptional, IsString } from 'class-validator';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

export class BuscadorProductoDto  extends PaginadorDto {
  @IsString()
  @IsOptional()
  marca: string;
  @IsString()
  @IsOptional()
  serie: string;
  @IsString()
  @IsOptional()
  codigoQr: string;
  @IsString()
  @IsOptional()
  color: string;

    @IsString()
  @IsOptional()
  tipoProducto: string;

  
    @IsString()
  @IsOptional()
  categoria: string;

}

