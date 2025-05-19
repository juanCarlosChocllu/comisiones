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
import { PreciosE } from 'src/comision-receta/enum/precio';


export class CreateComisionServicioDto {
      @IsMongoId()
      @IsNotEmpty()
      servicio: Types.ObjectId;
      @IsArray()
      @ArrayMinSize(1)
      @Type(() => DataComisionRecetaDto)
      @ValidateNested()
      data: DataComisionRecetaDto[];
}
export class DataComisionRecetaDto {
    
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