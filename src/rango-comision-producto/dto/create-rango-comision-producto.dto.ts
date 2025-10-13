import { Transform } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';

export class CreateRangoComisionProductoDto {
  @IsNumber({}, { message: 'El precio mínimo debe ser un número.' })
  @Min(0, { message: 'El precio mínimo debe ser al menos 0.' })
  @IsNotEmpty({ message: 'El precio mínimo es obligatorio.' })
  precioMinimo: number;

  @IsNumber({}, { message: 'El precio máximo debe ser un número.' })
  @Min(1, { message: 'El precio máximo debe ser al menos 1.' })
  @IsNotEmpty({ message: 'El precio máximo es obligatorio.' })
  
  precioMaximo: number;

  @IsMongoId({ message: 'El ID del precio debe ser un ID válido de MongoDB.' })
  @IsNotEmpty({ message: 'El ID del precio es obligatorio.' })
  precio: Types.ObjectId;

  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @IsNumber({}, { message: 'La comisión debe ser un número.' })
  @Min(0, { message: 'La comisión debe ser al menos 0.' })
  @IsNotEmpty({ message: 'La comisión es obligatoria.' })
  comision: number;


  



}
