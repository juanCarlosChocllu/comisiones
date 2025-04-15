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

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(+id);
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providersService.remove(+id);
  }
}
