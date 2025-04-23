import { Transform } from "class-transformer"
import { IsNumber, IsOptional, IsString, Min } from "class-validator"

export class PaginadorDto {
    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    limite: number =10;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    pagina: number = 1;
}