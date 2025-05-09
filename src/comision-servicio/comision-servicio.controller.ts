import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionServicioService } from './comision-servicio.service';
import { CreateComisionServicioDto } from './dto/create-comision-servicio.dto';
import { UpdateComisionServicioDto } from './dto/update-comision-servicio.dto';

@Controller('comision-servicio')
export class ComisionServicioController {
  constructor(private readonly comisionServicioService: ComisionServicioService) {}


}
