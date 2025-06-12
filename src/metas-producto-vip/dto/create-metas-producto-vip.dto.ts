import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateMetasProductoVipDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => MetaData)
  @ValidateNested({ each: true })
  data: MetaData[];
}

class MetaData {
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  montura: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precioMontura: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  gafa: number;

  @IsOptional()
  @IsArray()
  marcaMonturas: string[];

  @IsOptional()
  @IsArray()
  marcaGafas: string[];

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  precioGafa: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  lenteDeContacto: number;

  @IsMongoId()
  @IsNotEmpty()
  sucursal: Types.ObjectId;
}
