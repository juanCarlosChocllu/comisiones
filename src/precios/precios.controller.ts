import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreciosService } from './service/precios.service';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';

@Controller('precios')
export class PreciosController {
  constructor(private readonly preciosService: PreciosService) {}

  @Post()
  create(@Body() createPrecioDto: CreatePrecioDto) {
    return this.preciosService.create(createPrecioDto);
  }

  @Get()
  findAll() {
    return this.preciosService.findAll();
  }
  
  @Get('combinacion/:id')
  listarTiposDePrecioCombinacion(@Param('id', ValidateIdPipe) id:Types.ObjectId ) {
    return this.preciosService.listarTiposDePrecioCombinacion(id);
  }

  @Get('producto/:id')
  listarTiposDePrecioProducto(@Param('id', ValidateIdPipe) id:Types.ObjectId ) {
    return this.preciosService.listarTiposDePrecioProducto(id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preciosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePrecioDto: UpdatePrecioDto) {
    return this.preciosService.update(+id, updatePrecioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preciosService.remove(+id);
  }
}
