import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateMetasProductoVipDto {
  @IsNumber()
  @IsOptional()
  monturaMasGafa: number;

  @IsNumber()
  @IsOptional()
  lenteDeContacto: number;
}
