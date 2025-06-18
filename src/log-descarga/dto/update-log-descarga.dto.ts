import { PartialType } from '@nestjs/swagger';
import { CreateLogDescargaDto } from './create-log-descarga.dto';

export class UpdateLogDescargaDto extends PartialType(CreateLogDescargaDto) {}
