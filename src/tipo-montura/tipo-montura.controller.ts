import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoMonturaService } from './tipo-montura.service';
import { CreateTipoMonturaDto } from './dto/create-tipo-montura.dto';
import { UpdateTipoMonturaDto } from './dto/update-tipo-montura.dto';

@Controller('tipo-montura')
export class TipoMonturaController {
  constructor(private readonly tipoMonturaService: TipoMonturaService) {}

  @Post()
  create(@Body() createTipoMonturaDto: CreateTipoMonturaDto) {
    return this.tipoMonturaService.create(createTipoMonturaDto);
  }

  @Get()
  findAll() {
    return this.tipoMonturaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoMonturaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoMonturaDto: UpdateTipoMonturaDto) {
    return this.tipoMonturaService.update(+id, updateTipoMonturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoMonturaService.remove(+id);
  }
}
