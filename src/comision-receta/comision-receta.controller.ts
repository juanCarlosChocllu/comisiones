import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionRecetaService } from './comision-receta.service';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';

@Controller('comision/receta')
export class ComisionRecetaController {
  constructor(private readonly comisionRecetaService: ComisionRecetaService) {}

  @Post()
  create(@Body() createComisionRecetaDto: CreateComisionRecetaDto) {
    return this.comisionRecetaService.create(createComisionRecetaDto);
  }

  @Get()
  findAll() {
    return this.comisionRecetaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comisionRecetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComisionRecetaDto: UpdateComisionRecetaDto) {
    return this.comisionRecetaService.update(+id, updateComisionRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comisionRecetaService.remove(+id);
  }
}
