import { PartialType } from '@nestjs/mapped-types';
import { CreateColorLenteDto } from './create-color-lente.dto';

export class UpdateColorLenteDto extends PartialType(CreateColorLenteDto) {}
