import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { BuscadorMarcaDto } from './dto/BuscadorMarca.dto';
@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.marcaService.create(createMarcaDto);
  }

  @Get()
  listar(@Query() buscadorMarcaDto:BuscadorMarcaDto) {
    return this.marcaService.listar(buscadorMarcaDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marcaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarcaDto: UpdateMarcaDto) {
    return this.marcaService.update(+id, updateMarcaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marcaService.remove(+id);
  }
}
