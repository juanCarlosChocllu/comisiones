import { PartialType } from '@nestjs/mapped-types';
import { CreateComisionRecetaDto } from './create-comision-receta.dto';

export class UpdateComisionRecetaDto extends PartialType(CreateComisionRecetaDto) {}
