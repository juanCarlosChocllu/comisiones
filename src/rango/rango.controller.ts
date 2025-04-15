import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RangoService } from './rango.service';
import { CreateRangoDto } from './dto/create-rango.dto';
import { UpdateRangoDto } from './dto/update-rango.dto';

@Controller('rango')
export class RangoController {
  constructor(private readonly rangoService: RangoService) {}

  @Post()
  create(@Body() createRangoDto: CreateRangoDto) {
    return this.rangoService.create(createRangoDto);
  }

  @Get()
  findAll() {
    return this.rangoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rangoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRangoDto: UpdateRangoDto) {
    return this.rangoService.update(+id, updateRangoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rangoService.remove(+id);
  }
}
