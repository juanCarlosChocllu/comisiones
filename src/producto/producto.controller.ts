import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }
  @Get()
  listarProductos(@Query() paginadorDto:PaginadorDto ){
    return this.productoService.listarProductos(paginadorDto)
  }

  @Get('sinComision')
  listarProductosSinComision(@Query() paginadorDto:PaginadorDto ){
    return this.productoService.listarProductosSinComision(paginadorDto)
  }
} 
