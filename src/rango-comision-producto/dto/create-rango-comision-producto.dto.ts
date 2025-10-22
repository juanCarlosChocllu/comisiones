import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRangoComisionProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'Debe haber al menos un detalle.' })
  @Type(() => DetalleRangoComisionProductoDto)
  detalle: DetalleRangoComisionProductoDto[];

   @IsNumber({}, { message: 'El precio mínimo debe ser un número.' })
  @Min(0, { message: 'El precio mínimo debe ser al menos 0.' })
  @IsNotEmpty({ message: 'El precio mínimo es obligatorio.' })
  precioMinimo: number;

  @IsNumber({}, { message: 'El precio máximo debe ser un número.' })
  @Min(1, { message: 'El precio máximo debe ser al menos 1.' })
  @IsNotEmpty({ message: 'El precio máximo es obligatorio.' })
  precioMaximo: number;
}

export class DetalleRangoComisionProductoDto {
 

  @IsMongoId({ message: 'El ID del precio debe ser un ID válido de MongoDB.' })
  @IsNotEmpty({ message: 'El ID del precio es obligatorio.' })
  precio: Types.ObjectId;

  

  @IsNumber({}, { message: 'La comisión debe ser un número.' })
  @Min(0, { message: 'La comisión debe ser al menos 0.' })
  @IsNotEmpty({ message: 'La comisión es obligatoria.' })
  comision: number;
}
