import { PartialType } from '@nestjs/mapped-types';
import { CreateMetasProductoVipDto } from './create-metas-producto-vip.dto';

export class UpdateMetasProductoVipDto extends PartialType(CreateMetasProductoVipDto) {}
