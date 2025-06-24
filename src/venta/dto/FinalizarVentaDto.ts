import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class FinalizarVentaDto {
  @IsString()
  @IsNotEmpty()
  idVenta: string;

  @IsString()
  @IsNotEmpty()
  flag: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  descuento: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  montoTotal:number

  @IsUUID()
  @IsNotEmpty()
  key: string;
}
