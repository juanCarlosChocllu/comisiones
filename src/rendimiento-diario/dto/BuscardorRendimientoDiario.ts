import {
  IsBoolean,
  IsMongoId,
  isMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Types } from 'mongoose';
import { FechasDto } from 'src/core/dto/FechasDto';

export class BuscadorRendimientoDiarioDto extends FechasDto {
  @IsMongoId({ each: true })
  @IsNotEmpty()
  sucursal: Types.ObjectId[];

  @IsMongoId({ each: true })
  @IsOptional()
  asesor: Types.ObjectId[];

  @IsMongoId({ each: true })
  @IsOptional()
  tipoVenta: Types.ObjectId[];

  @IsNotEmpty()
  flagVenta: string;

  @IsOptional()
  @IsBoolean()
  comisiona: boolean | null;
}
