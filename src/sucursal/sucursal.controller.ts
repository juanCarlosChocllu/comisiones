import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SucursalService } from './sucursal.service';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
import { Publico } from 'src/autenticacion/decorators/publico';

@Controller('sucursal')
export class SucursalController {
  constructor(private readonly sucursalService: SucursalService) {}

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

  
  @Publico()
  @Post('/guardarSucursal')
  guardarSucursal (@Body() body: { empresa: string; sucursal: string }) {
    return this.sucursalService.guardarSucursal(body.empresa, body.sucursal);
  }
}
