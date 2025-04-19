import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CombinacionRecetaService } from './combinacion-receta.service';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';

@Controller('combinacion/receta')
export class CombinacionRecetaController {
  constructor(private readonly combinacionRecetaService: CombinacionRecetaService) {}

  @Post()
  create(@Body() createCombinacionRecetaDto: CreateCombinacionRecetaDto) {


    return this.combinacionRecetaService.create(createCombinacionRecetaDto);
  }

  @Get()
  findAll() {
    return this.combinacionRecetaService.listar();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combinacionRecetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCombinacionRecetaDto: UpdateCombinacionRecetaDto) {
    return this.combinacionRecetaService.update(+id, updateCombinacionRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combinacionRecetaService.remove(+id);
  }
}
