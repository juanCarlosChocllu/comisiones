import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateComisionProductoDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(()=>DataComisionProducto)
  @ValidateNested()
  data:DataComisionProducto[]
}

class DataComisionProducto {
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

    @IsNotEmpty()
        @IsBoolean()
        base:string
}