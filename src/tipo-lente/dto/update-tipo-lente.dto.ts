import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoLenteDto } from './create-tipo-lente.dto';

export class UpdateTipoLenteDto extends PartialType(CreateTipoLenteDto) {}
