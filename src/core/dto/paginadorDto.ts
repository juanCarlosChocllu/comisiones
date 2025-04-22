import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class PaginadorDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    limite: number =10;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    pagina: number = 1;
}