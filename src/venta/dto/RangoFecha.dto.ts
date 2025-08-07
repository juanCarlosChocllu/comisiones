import { Transform } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class RangoFecha {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0, 0);
    return date;
  })
  fechaInicio: Date;

  
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => {
    const date = new Date(value);
    date.setUTCHours(23, 59, 59);
    return date;
  })
  fechaFin: Date;
}
