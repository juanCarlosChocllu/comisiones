import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetasProductoVipService } from './metas-producto-vip.service';
import { CreateMetasProductoVipDto } from './dto/create-metas-producto-vip.dto';
import { UpdateMetasProductoVipDto } from './dto/update-metas-producto-vip.dto';

@Controller('metas/producto/vip')
export class MetasProductoVipController {
  constructor(private readonly metasProductoVipService: MetasProductoVipService) {}

  @Post()
  create(@Body() createMetasProductoVipDto: CreateMetasProductoVipDto) {
    return this.metasProductoVipService.create(createMetasProductoVipDto);
  }

  @Get()
  findAll() {
    return this.metasProductoVipService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metasProductoVipService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetasProductoVipDto: UpdateMetasProductoVipDto) {
    return this.metasProductoVipService.update(+id, updateMetasProductoVipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metasProductoVipService.remove(+id);
  }
}
