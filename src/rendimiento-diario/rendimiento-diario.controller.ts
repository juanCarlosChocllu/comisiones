import { Controller,  Post, Body,  Req, Query, Get , Patch,Param} from '@nestjs/common';
import { RendimientoDiarioService } from './rendimiento-diario.service';
import { CreateRendimientoDiarioDto } from './dto/create-rendimiento-diario.dto';
import { Request}from 'express'
import { BuscadorRendimientoDiarioDto } from './dto/BuscardorRendimientoDiario';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { FechasDto } from 'src/core/dto/FechasDto';
import { UpdateRendimientoDiarioDto } from './dto/update-rendimiento-diario.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
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

  @Post('asesor')
  rendimientoDiario(@Req() request:Request  ) {
    return this.rendimientoDiarioService.rendimientoDiarioAsesor(request);
  }
  @Patch("/:id")
  update(@Param('id', ValidateIdPipe) id:Types.ObjectId,@Body() updateRendimientoDiarioDto: UpdateRendimientoDiarioDto) {
    return this.rendimientoDiarioService.update(updateRendimientoDiarioDto, id);
  }

 
}
