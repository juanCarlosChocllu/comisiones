import { PartialType } from '@nestjs/swagger';
import { CreateRendimientoDiarioDto } from './create-rendimiento-diario.dto';

export class UpdateRendimientoDiarioDto extends PartialType(CreateRendimientoDiarioDto) {}
