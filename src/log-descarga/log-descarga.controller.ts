import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogDescargaService } from './log-descarga.service';
import { CreateLogDescargaDto } from './dto/create-log-descarga.dto';
import { UpdateLogDescargaDto } from './dto/update-log-descarga.dto';

@Controller('log-descarga')
export class LogDescargaController {
  constructor(private readonly logDescargaService: LogDescargaService) {}

  @Post()
  create(@Body() createLogDescargaDto: CreateLogDescargaDto) {
    return this.logDescargaService.create(createLogDescargaDto);
  }

  @Get()
  findAll() {
    return this.logDescargaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logDescargaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDescargaDto: UpdateLogDescargaDto) {
    return this.logDescargaService.update(+id, updateLogDescargaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logDescargaService.remove(+id);
  }
}
