import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MetasSucursalService } from './metas-sucursal.service';
import { CreateMetasSucursalDto } from './dto/create-metas-sucursal.dto';
import { UpdateMetasSucursalDto } from './dto/update-metas-sucursal.dto';
import { Publico } from 'src/autenticacion/decorators/publico';

@Controller('metas/sucursal')
export class MetasSucursalController {
  constructor(private readonly metasSucursalService: MetasSucursalService) {}

  @Post('webhook')
  @Publico()
  create(@Body() createMetasSucursalDto: CreateMetasSucursalDto) {
    return this.metasSucursalService.create(createMetasSucursalDto);
  }

 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metasSucursalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetasSucursalDto: UpdateMetasSucursalDto) {
    return this.metasSucursalService.update(+id, updateMetasSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metasSucursalService.remove(+id);
  }
}
