import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
import { Request } from 'express';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  listarusuarios() {
    return this.usuarioService.listarusuarios();
  }

  @Get(':id')
  findOne(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  actulizar(
    @Param('id', ValidateIdPipe) id: Types.ObjectId,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.actulizar(id, updateUsuarioDto);
  }

  @Delete(':id')
  softDelete(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.usuarioService.softDelete(id);
  }

  @Get('asignar/sucursal/:asesor')
  asignarSucursalAusuario(
    @Req() request: Request,
    @Param('asesor', ValidateIdPipe) asesor: Types.ObjectId,
  ) {
    return this.usuarioService.asignarSucursalAusuario(asesor, request);
  }

  @Get('verificar/rol')
  verificarRol(
    @Req() request: Request,
  ) {
    return this.usuarioService.verificarRol(request);
  }
}
