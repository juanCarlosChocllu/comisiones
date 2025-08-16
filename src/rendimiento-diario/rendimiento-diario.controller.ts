import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RendimientoDiarioService } from './rendimiento-diario.service';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';

@Controller('rendimiento/diario')
export class RendimientoDiarioController {
  constructor(private readonly rendimientoDiarioService: RendimientoDiarioService) {}

  @Post()
  create(@Body() createRendimientoDiarioDto: CreateRendimientoDiarioDto) {
    return this.rendimientoDiarioService.create(createRendimientoDiarioDto);
  }

  @Get()
  findAll() {
    return this.rendimientoDiarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rendimientoDiarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRendimientoDiarioDto: UpdateRendimientoDiarioDto) {
    return this.rendimientoDiarioService.update(+id, updateRendimientoDiarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rendimientoDiarioService.remove(+id);
  }
}
