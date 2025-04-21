import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Types } from 'mongoose';
import { tipoComisionE } from 'src/core/enum/tipoComision';

export class CreateComisionProductoDto {
  @IsString()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  monto: string;

  @IsMongoId()
  @IsNotEmpty()
  producto: Types.ObjectId;

  @IsEnum(tipoComisionE)
  @IsNotEmpty()
  tipoComision: string;
}
