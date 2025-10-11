import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseBoolPipe,
  Type,
} from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
import { Request } from 'express';
@Controller('asesor')
export class AsesorController {
  constructor(private readonly asesorService: AsesorService) {}

  @Get()
  listar() {
    return this.asesorService.listar();
  }

  @Patch(':id')
  asignarGestor(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body('gestor', ParseBoolPipe) gestor: boolean,
  ) {
    return this.asesorService.asesorService(gestor, id);
  }

  @Get('sucursal')
  listarSucursalesAsesor(@Req() request: Request) {
    return this.asesorService.listarSucursalesAsesor(request);
  }

   @Get('sucursal/:usuario')
  listarSucursalesAsesores(@Param('usuario', ValidateIdPipe) usuario: Types.ObjectId) {
    return this.asesorService.listarSucursalesAsesores(usuario);
  }
  

  @Get('sin/usuario')
  listarAsesorSinUsario() {
    return this.asesorService.listarAsesorSinUsario();
  }
}
