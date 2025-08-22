import { Controller,  Post, Body,  Req, Query, Get } from '@nestjs/common';
import { RendimientoDiarioService } from './rendimiento-diario.service';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { Request}from 'express'
import { BuscadorRendimientoDiarioDto } from './dto/BuscardorRendimientoDiario';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
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
  
  @Get('listar/asesor')
  listarRendimientoDiarioAsesor( @Req() request:Request, @Query() paginadorDto: PaginadorDto) {
    return this.rendimientoDiarioService.listarRendimientoDiarioAsesor(request, paginadorDto);
  }
  

 
}
