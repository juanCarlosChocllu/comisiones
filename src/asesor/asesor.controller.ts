import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AsesorService } from './asesor.service';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';

@Controller('asesor')
export class AsesorController {
  constructor(private readonly asesorService: AsesorService) {}

  @Post()
  create(@Body() createAsesorDto: CreateAsesorDto) {
    return this.asesorService.create(createAsesorDto);
  }


  
}
