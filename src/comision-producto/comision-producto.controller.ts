import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionProductoService } from './comision-producto.service';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { UpdateComisionProductoDto } from './dto/update-comision-producto.dto';

@Controller('comision-producto')
export class ComisionProductoController {
  constructor(private readonly comisionProductoService: ComisionProductoService) {}

  @Post()
  create(@Body() createComisionProductoDto: CreateComisionProductoDto) {
    return this.comisionProductoService.create(createComisionProductoDto);
  }

  @Get()
  findAll() {
    return this.comisionProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comisionProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateComisionProductoDto: UpdateComisionProductoDto) {
    return this.comisionProductoService.update(+id, updateComisionProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.comisionProductoService.remove(+id);
  }
}
