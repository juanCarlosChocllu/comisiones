import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProvidersService } from '../services/providers.service';
import { DescargarProviderDto } from '../dto/create-provider.dto';


@Controller('provider/mia/venta')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  descargarVentas(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.descargarVentasMia(descargarProviderDto);
  }

  @Post('excel/comisiones')
  guardarComisiones(){
    return this.providersService.guardarComisiones()
  }

 
}
