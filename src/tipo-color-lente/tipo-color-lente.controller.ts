import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoColorLenteService } from './tipo-color-lente.service';
import { CreateTipoColorLenteDto } from './dto/create-tipo-color-lente.dto';
import { UpdateTipoColorLenteDto } from './dto/update-tipo-color-lente.dto';

@Controller('tipo-color-lente')
export class TipoColorLenteController {
  constructor(private readonly tipoColorLenteService: TipoColorLenteService) {}

 

  @Get()
  findAll() {
    return this.tipoColorLenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoColorLenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoColorLenteDto: UpdateTipoColorLenteDto) {
    return this.tipoColorLenteService.update(+id, updateTipoColorLenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoColorLenteService.remove(+id);
  }
}
