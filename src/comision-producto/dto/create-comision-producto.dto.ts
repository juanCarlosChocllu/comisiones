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
  @IsNotEmpty()
  nombre:string

  @IsNumber()
  @IsNotEmpty()
  monto:number

  @IsNumber()
  @IsNotEmpty()
  diferencia:number

  @IsNumber()
  @IsNotEmpty()
  comision:number

  @IsNotEmpty()
  @IsMongoId()
  precio:Types.ObjectId

  @IsNotEmpty()
  @IsBoolean()
  base:string
}