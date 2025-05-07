import { PartialType } from '@nestjs/swagger';
import { CreateComisionServicioDto } from './create-comision-servicio.dto';

export class UpdateComisionServicioDto extends PartialType(CreateComisionServicioDto) {}
