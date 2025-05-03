import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res} from '@nestjs/common';
import { CombinacionRecetaService } from './combinacion-receta.service';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import {Response} from 'express'
@Controller('combinacion/receta')
export class CombinacionRecetaController {
  constructor(private readonly combinacionRecetaService: CombinacionRecetaService) {}

  @Post()
  create(@Body() createCombinacionRecetaDto: CreateCombinacionRecetaDto) {


    return this.combinacionRecetaService.create(createCombinacionRecetaDto);
  }

  @Get()
  listarCombinaciones(@Query () paginadorDto:PaginadorDto) {
    return this.combinacionRecetaService.listarCombinaciones(paginadorDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.combinacionRecetaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCombinacionRecetaDto: UpdateCombinacionRecetaDto) {
    return this.combinacionRecetaService.update(+id, updateCombinacionRecetaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.combinacionRecetaService.remove(+id);
  }
}
