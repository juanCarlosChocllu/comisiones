import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarcaLenteService } from './marca-lente.service';
import { CreateMarcaLenteDto } from './dto/create-marca-lente.dto';
import { UpdateMarcaLenteDto } from './dto/update-marca-lente.dto';

@Controller('marca-lente')
export class MarcaLenteController {
  constructor(private readonly marcaLenteService: MarcaLenteService) {}

  @Post()
  create(@Body() createMarcaLenteDto: CreateMarcaLenteDto) {
    return this.marcaLenteService.create(createMarcaLenteDto);
  }

  @Get()
  findAll() {
    return this.marcaLenteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaLenteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaLenteDto: UpdateMarcaLenteDto) {
    return this.marcaLenteService.update(+id, updateMarcaLenteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaLenteService.remove(+id);
  }
}
