import { PartialType } from '@nestjs/mapped-types';
import { CreateRangoDto } from './create-rango.dto';

export class UpdateRangoDto extends PartialType(CreateRangoDto) {}
