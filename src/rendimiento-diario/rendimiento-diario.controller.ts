import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { RendimientoDiarioService } from './rendimiento-diario.service';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';
import { Request}from 'express'
import { BuscadorRendimientoDiarioDto } from './dto/BuscardorRendimientoDiario';
@Controller('rendimiento/diario')
export class RendimientoDiarioController {
  constructor(private readonly rendimientoDiarioService: RendimientoDiarioService) {}

  @Post()
  create(@Req() request:Request,@Body() createRendimientoDiarioDto: CreateRendimientoDiarioDto) {
    return this.rendimientoDiarioService.create(createRendimientoDiarioDto, request);
  }

  @Post('listar')
  findAll(@Body() buscadorRendimientoDiarioDto:BuscadorRendimientoDiarioDto ) {
    return this.rendimientoDiarioService.findAll(buscadorRendimientoDiarioDto);
  }
  
  @Post('listar/asesor')
  listarRendimientoDiarioAsesor() {
    return this.rendimientoDiarioService.listarRendimientoDiarioAsesor();
  }
  

 
}
