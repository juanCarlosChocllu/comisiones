import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoVentaService } from './tipo-venta.service';
import { CreateTipoVentaDto } from './dto/create-tipo-venta.dto';
import { UpdateTipoVentaDto } from './dto/update-tipo-venta.dto';

@Controller('tipo-venta')
export class TipoVentaController {
  constructor(private readonly tipoVentaService: TipoVentaService) {}

  @Post()
  create(@Body() createTipoVentaDto: CreateTipoVentaDto) {
    return this.tipoVentaService.create(createTipoVentaDto);
  }

  @Get()
  findAll() {
    return this.tipoVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoVentaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoVentaDto: UpdateTipoVentaDto) {
    return this.tipoVentaService.update(+id, updateTipoVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoVentaService.remove(+id);
  }
}
