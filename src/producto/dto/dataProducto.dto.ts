import { IsBoolean, IsEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class dataProductoDto {
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
  @IsNotEmpty()
  serie: string;
  @IsString()
  @IsNotEmpty()
  color: string;
  @IsString()
  @IsOptional()
  tipoMontura: string;
  @IsString()
  @IsOptional()
  categoria: string;
  @IsString()
  @IsNotEmpty()
  codigoQR: string;
  @IsString()
  @IsOptional()
  descripcion: string;
  @IsString()
  @IsOptional()
  tamano: string;

  @IsNotEmpty()
  @IsBoolean()
  estuchePropio: boolean;
  precios: [
    {
      tipoPrecio: string;

      precio: number;
    },
  ];
}
