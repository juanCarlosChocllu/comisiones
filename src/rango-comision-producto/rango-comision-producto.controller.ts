import { Controller, Post, Body, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { RangoComisionProductoService } from './rango-comision-producto.service';
import { CreateRangoComisionProductoDto } from './dto/create-rango-comision-producto.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
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

   @Delete(":id")
   @HttpCode(HttpStatus.OK)
  eliminarComision(@Param("id", ValidateIdPipe) id:Types.ObjectId) {
    return this.rangoComisionProductoService.eliminarComision(id);
  }
}
