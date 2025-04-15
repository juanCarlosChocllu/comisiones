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

  @Get()
  findAll() {
    return this.asesorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.asesorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAsesorDto: UpdateAsesorDto) {
    return this.asesorService.update(+id, updateAsesorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.asesorService.remove(+id);
  }
}
