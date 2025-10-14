import { Controller, Post, Body, Get } from '@nestjs/common';
import { RangoComisionProductoService } from './rango-comision-producto.service';
import { CreateRangoComisionProductoDto } from './dto/create-rango-comision-producto.dto';
@Controller('rango/comision/producto')
export class RangoComisionProductoController {
  constructor(
    private readonly rangoComisionProductoService: RangoComisionProductoService,
  ) {}

  @Post()
  crearCOmision(
    @Body() createRangoComisionProductoDto: CreateRangoComisionProductoDto,
  ) {
    return this.rangoComisionProductoService.crearComision(
      createRangoComisionProductoDto,
    );
  }
  @Get()
  listarComisione() {
    return this.rangoComisionProductoService.listarComision();
  }
}
