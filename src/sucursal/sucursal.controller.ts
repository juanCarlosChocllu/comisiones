import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
import { Publico } from 'src/autenticacion/decorators/publico';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

  @Post()
  create(@Body() createSucursalDto: CreateSucursalDto) {
    return this.sucursalService.create(createSucursalDto);
  }
  @Post('empresa/guardar')
  guardar() {
    return this.sucursalService.guardarEmpresaYsusSucursales();
  }

  

  @Get('empresa/:id')  
  listarSucucrsalPorEmpresa(@Param('id', ValidateIdPipe) empresa:Types.ObjectId) {
    return this.sucursalService.listarSucucrsalPorEmpresa(empresa);
  }

  @Get()  
  listarSucursales() {
    return this.sucursalService.listarSucursales();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSucursalDto: UpdateSucursalDto) {
    return this.sucursalService.update(+id, updateSucursalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalService.remove(+id);
  }
}
