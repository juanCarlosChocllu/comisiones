import { PartialType } from '@nestjs/swagger';
import { CreateRangoComisionProductoDto } from './create-rango-comision-producto.dto';

export class UpdateRangoComisionProductoDto extends PartialType(CreateRangoComisionProductoDto) {}
