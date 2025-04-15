import { IsArray, ValidateNested } from "class-validator"
import { DataCombiancionDto } from "./dataCombinacion.dto"
import { Type } from "class-transformer"

export class CreateCombinacionRecetaDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DataCombiancionDto)
    data: DataCombiancionDto[];
  }