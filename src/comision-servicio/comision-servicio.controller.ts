import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';

@Controller('comision-servicio')
export class ComisionServicioController {
  constructor(private readonly comisionServicioService: ComisionServicioService) {}

  @Post()
  create(@Body() createComisionServicioDto: CreateComisionServicioDto) {
    return this.comisionServicioService.create(createComisionServicioDto);
  }

  @Get()
  findAll() {
    return this.comisionServicioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comisionServicioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComisionServicioDto: UpdateComisionServicioDto) {
    return this.comisionServicioService.update(+id, updateComisionServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comisionServicioService.remove(+id);
  }
}
