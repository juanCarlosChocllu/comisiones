import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { RangoComisionProductoService } from './rango-comision-producto.service';
import { CreateRangoComisionProductoDto } from './dto/create-rango-comision-producto.dto';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Types } from 'mongoose';
import { BuscadorRangoComisionProductoDto } from './schema/BuscadorRangoComisionProductoDto';
import { Response } from 'express';
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
  listarComisione(
    @Query() buscadorRangoComisionProductoDto: BuscadorRangoComisionProductoDto,
  ) {
    return this.rangoComisionProductoService.listarComision(
      buscadorRangoComisionProductoDto,
    );
  }

  @Get('excel/descargar')
  async descargarExcel(
    @Query() buscadorRangoComisionProductoDto: BuscadorRangoComisionProductoDto,
    @Res() response: Response,
  ) {
    const workbook = await this.rangoComisionProductoService.descargarExcel(
      buscadorRangoComisionProductoDto,
    );

    response.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="export.xlsx"',
    );
    await workbook.xlsx.write(response);
    return response.end();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  eliminarComision(@Param('id', ValidateIdPipe) id: Types.ObjectId) {
    return this.rangoComisionProductoService.eliminarComision(id);
  }
}
