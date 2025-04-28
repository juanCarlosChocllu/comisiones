import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionDto } from './dto/create-autenticacion.dto';


@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post()
  create(@Body() AutenticacionDto: AutenticacionDto) {
    return this.autenticacionService.autenticacion(AutenticacionDto);
  }


}
