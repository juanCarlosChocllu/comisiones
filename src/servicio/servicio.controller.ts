import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { PaginadorDto } from 'src/core/dto/paginadorDto';


@Controller('servicio')
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}


  @Get()
  listarServicios(@Query() paginadorDto:PaginadorDto) {
    return this.servicioService.listarServicios(paginadorDto);
  }

   @Get('sinComision')
      listarServiciosSinComision(@Query() paginadorDto:PaginadorDto ){
        return this.servicioService.listarServiciosSinComision(paginadorDto)
      }

}