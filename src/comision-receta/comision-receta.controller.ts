import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ComisionRecetaService } from './comision-receta.service';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';
import { ActualizarComisionReceta } from './dto/actulizarComisionReceta';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';

@Controller('comision/receta')
export class ComisionRecetaController {
  constructor(private readonly comisionRecetaService: ComisionRecetaService) {}

  @Post()
  create(@Body() createComisionRecetaDto: CreateComisionRecetaDto) {
    return this.comisionRecetaService.create(createComisionRecetaDto);
  }

  @Patch()
  actualizarComsion(@Body() actualizarComisionReceta: ActualizarComisionReceta) {
    return this.comisionRecetaService.actualizarComsion(actualizarComisionReceta);
  }

  
  @Delete(':id')
  eliminarComision(@Param('id', ValidateIdPipe) id:Types.ObjectId) {
    return this.comisionRecetaService.eliminarComision(id);
  }


}
