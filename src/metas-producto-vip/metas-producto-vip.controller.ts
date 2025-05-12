import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetasProductoVipService } from './metas-producto-vip.service';
import { CreateMetasProductoVipDto } from './dto/create-metas-producto-vip.dto';
import { UpdateMetasProductoVipDto } from './dto/update-metas-producto-vip.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';

@Controller('metas/producto/vip')
export class MetasProductoVipController {
  constructor(private readonly metasProductoVipService: MetasProductoVipService) {}

  @Post()
  create(@Body() createMetasProductoVipDto: CreateMetasProductoVipDto) {
    return this.metasProductoVipService.create(createMetasProductoVipDto);
  }

  @Get()
  listar() {
    return this.metasProductoVipService.listar();
  }

  @Get(':id')
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.metasProductoVipService.findOne(id);
  }

  @Patch(':id')
  actulizar(@Param('id', ValidateIdPipe) id: Types.ObjectId, @Body() updateMetasProductoVipDto: UpdateMetasProductoVipDto) {
    return this.metasProductoVipService.actulizar(id, updateMetasProductoVipDto);
  }

  @Delete(':id')
  softDelete(@Param('id',ValidateIdPipe) id: Types.ObjectId) {
    return this.metasProductoVipService.softDelete(id);
  }
}
