import { PartialType } from '@nestjs/swagger';
import { CreateRangoComisionDto } from './create-rango-comision.dto';

export class UpdateRangoComisionDto extends PartialType(CreateRangoComisionDto) {}
