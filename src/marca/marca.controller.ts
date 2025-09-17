import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { UpdateMarcaDto } from './dto/update-marca.dto';
import { BuscadorMarcaDto } from './dto/BuscadorMarca.dto';
import { AsignarCategoriaDto } from './dto/asignarCategoriaDto';
@Controller('marca')
export class MarcaController {
  constructor(private readonly marcaService: MarcaService) {}
  @Get()
  listar(@Query() buscadorMarcaDto:BuscadorMarcaDto) {
    return this.marcaService.listar(buscadorMarcaDto);
  }
  @Get("comisiones")
  listarMarcas() {
    return this.marcaService.listarMarcas();
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

  @Post('categoria')
  @HttpCode(HttpStatus.OK)
  asignarCategoriaMarca(@Body() asignarCategoriaDto:AsignarCategoriaDto){
    return this.marcaService.asignarCategoriaMarca(asignarCategoriaDto)
  }
}
