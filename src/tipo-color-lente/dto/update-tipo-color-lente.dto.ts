import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoColorLenteDto } from './create-tipo-color-lente.dto';

export class UpdateTipoColorLenteDto extends PartialType(CreateTipoColorLenteDto) {}
