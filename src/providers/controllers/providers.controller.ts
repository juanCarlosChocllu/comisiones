import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvidersService } from '../services/providers.service';
import { DescargarProviderDto } from '../dto/create-provider.dto';


@Controller('provider')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('mia/venta')
  descargarVentas(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.descargarVentasMia(descargarProviderDto);
  }

  @Post('excel/combinaciones/comisiones')
  guardarComisionesReceta(){
    return this.providersService.guardarComisionesReceta()
  }

  @Post('excel/producto/comisiones')
  guardarComisionesProducto(){
    return this.providersService.guardarComisionesProducto()
  }

  @Post('excel/servicio/comisiones')
  guardarComisionesServicio(){
    return this.providersService.guardarComisionesServicio()
  }
 
}
