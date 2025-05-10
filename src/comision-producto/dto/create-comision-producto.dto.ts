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
import { PreciosE } from 'src/comision-receta/enum/precio';

export class CreateComisionProductoDto {
  @IsNotEmpty()
  @IsMongoId()
  producto:Types.ObjectId
  @IsArray()
  @ArrayMinSize(1)
  @Type(()=>DataComisionProducto)
  @ValidateNested()
  data:DataComisionProducto[]
}

class DataComisionProducto {
  @IsString()
    @IsNotEmpty()
    precio: string;
  
    @IsString()
    @IsNotEmpty()
    nombre: string;
  
    @IsNumber()
    @IsNotEmpty()
    monto: number;
}