import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoLenteService } from './tipo-lente.service';
import { CreateTipoLenteDto } from './dto/create-tipo-lente.dto';
import { UpdateTipoLenteDto } from './dto/update-tipo-lente.dto';

@Controller('tipo-lente')
export class TipoLenteController {
  constructor(private readonly tipoLenteService: TipoLenteService) {}


  @Get()
  findAll() {
    return this.tipoLenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoLenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoLenteDto: UpdateTipoLenteDto) {
    return this.tipoLenteService.update(+id, updateTipoLenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoLenteService.remove(+id);
  }
}
