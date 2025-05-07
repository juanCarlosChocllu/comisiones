import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionProductoService } from './comision-producto.service';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { ActualizarProductoComisionDto } from './dto/ActualizarComisionProducto.dto';

@Controller('comision/producto')
export class ComisionProductoController {
  constructor(private readonly comisionProductoService: ComisionProductoService) {}

  @Post()
  create(@Body() createComisionProductoDto: CreateComisionProductoDto) {
    return this.comisionProductoService.create(createComisionProductoDto);
  }


 
  @Patch()
  actulizaComision(@Body() actualizarProductoComisionDto: ActualizarProductoComisionDto) {
    return this.comisionProductoService.actulizaComision(actualizarProductoComisionDto);
  }

}
