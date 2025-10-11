import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RangoComisionService } from './rango-comision.service';
import { CreateRangoComisionDto } from './dto/create-rango-comision.dto';
import { UpdateRangoComisionDto } from './dto/update-rango-comision.dto';

@Controller('rango/comision')
export class RangoComisionController {
  constructor(private readonly rangoComisionService: RangoComisionService) {}

  @Post()
  create(@Body() createRangoComisionDto: CreateRangoComisionDto) {
    return this.rangoComisionService.create(createRangoComisionDto);
  }

  @Get()
  findAll() {
    return this.rangoComisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rangoComisionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRangoComisionDto: UpdateRangoComisionDto) {
    return this.rangoComisionService.update(+id, updateRangoComisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rangoComisionService.remove(+id);
  }
}
