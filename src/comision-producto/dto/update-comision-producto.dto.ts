import { PartialType } from '@nestjs/mapped-types';
import { CreateComisionProductoDto } from './create-comision-producto.dto';

export class UpdateComisionProductoDto extends PartialType(CreateComisionProductoDto) {}
