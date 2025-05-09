import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';

@Controller('comision/servicio')
export class ComisionServicioController {
  constructor(private readonly comisionServicioService: ComisionServicioService) {}

  @Post()
  crearComision (@Body() createComisionServicioDto:CreateComisionServicioDto) {
    return this.comisionServicioService.crearComision(createComisionServicioDto)

  }

}
