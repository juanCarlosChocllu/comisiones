import { PartialType } from '@nestjs/mapped-types';
import { CreateCombinacionRecetaDto } from './create-combinacion-receta.dto';

export class UpdateCombinacionRecetaDto extends PartialType(CreateCombinacionRecetaDto) {}
