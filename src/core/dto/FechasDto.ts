import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class FechasDto {
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {
    const date = new Date(value);
    date.setUTCHours(0, 0, 0);
    return date
  })
  fechaInicio: Date;

  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => {

    
    const date = new Date(value);
    date.setUTCHours(23, 59, 59);
    return date
  })
  fechaFin: Date;
}
