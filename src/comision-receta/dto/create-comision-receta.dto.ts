import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { PreciosE } from '../enum/precio';

export class CreateComisionRecetaDto {
  @IsMongoId()
  @IsNotEmpty()
  combinacionReceta: Types.ObjectId;
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => DataComisionRecetaDto)
  @ValidateNested()
  data: DataComisionRecetaDto[];
}

export class DataComisionRecetaDto {

 /* @IsMongoId()
  @IsNotEmpty()
  combinacionReceta: Types.ObjectId;*/

  @IsString()
  @IsNotEmpty()
  precio: string;

  @IsNumber()
  @IsNotEmpty()
  monto: number;

  
     @IsString()
     @IsNotEmpty()
     nombre: string;



}
