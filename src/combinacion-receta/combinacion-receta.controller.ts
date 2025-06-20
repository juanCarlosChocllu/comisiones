import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res} from '@nestjs/common';
import { CombinacionRecetaService } from './combinacion-receta.service';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import {Response} from 'express'
import { BuscadorCombinacionDto } from './dto/buscadorCombinacionReceta.dto';
import { CrearCombinacionDto } from './dto/CrearCombinacion.dto';
import { Publico } from 'src/autenticacion/decorators/publico';
@Controller('combinacion/receta')
export class CombinacionRecetaController {
  constructor(private readonly combinacionRecetaService: CombinacionRecetaService) {}

  @Post()
  @Publico()
  create(@Body() createCombinacionRecetaDto: CreateCombinacionRecetaDto) {
    
    return this.combinacionRecetaService.create(createCombinacionRecetaDto);
  }
  @Publico()
  @Post('crear')
  crearCombinacion(@Body()crearCombinacionDto : CrearCombinacionDto) {
    return this.combinacionRecetaService.crearCombinaciones(crearCombinacionDto);
  }

  @Get()
  listarCombinaciones(@Query () buscadorCombinacionDto:BuscadorCombinacionDto) {
    return this.combinacionRecetaService.listarCombinaciones(buscadorCombinacionDto);
  }

  @Get('sinComision')
  listarCombinacionesSinComision() {
    return this.combinacionRecetaService.combinacionesSinComision();
  }
  
  @Get('descargar')
  async descargarCombinaciones(@Res() response: Response) {
    const  workbook =await this.combinacionRecetaService.descargarCombinaciones();
    
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="export.xlsx"',
    );
    await workbook.xlsx.write(response);
    return response.end();
  }

   @Get('descargar/sinComision')
  async descargarCombinacionesSinComision(@Res() response: Response) {
    const  workbook =await this.combinacionRecetaService.descargarCombinacionesSinComision();
    
    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="export.xlsx"',
    );
    await workbook.xlsx.write(response);
    return response.end();
  }

}
