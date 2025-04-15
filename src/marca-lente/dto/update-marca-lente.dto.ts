import { PartialType } from '@nestjs/mapped-types';
import { CreateMarcaLenteDto } from './create-marca-lente.dto';

export class UpdateMarcaLenteDto extends PartialType(CreateMarcaLenteDto) {}
