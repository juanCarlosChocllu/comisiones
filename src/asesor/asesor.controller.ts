import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, Type } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';

@Controller('asesor')
export class AsesorController {
  constructor(private readonly asesorService: AsesorService) {}

  
  @Get()
  listar() {
    return this.asesorService.listar();
  }

  @Patch(':id')
  asignarGestor(@Param('id', ValidateIdPipe) id:Types.ObjectId ,@Body('gestor',ParseBoolPipe) gestor:boolean ){
    return this.asesorService.asesorService(gestor, id)

  }

  @Post()
  create(@Body() createAsesorDto: CreateAsesorDto) {
    return this.asesorService.create(createAsesorDto);
  }


  
}
