import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ServicioService } from './servicio.service';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { Publico } from 'src/core/decorators/publico';
import {Response} from 'express'
@Controller('servicio')
export class ServicioController {
  constructor(private readonly servicioService: ServicioService) {}

  @Get()
  listarServicios(@Query() paginadorDto: PaginadorDto) {
    return this.servicioService.listarServicios(paginadorDto);
  }
  @Get('sinComision')
  listarServiciosSinComision(@Query() paginadorDto: PaginadorDto) {
    return this.servicioService.listarServiciosSinComision(paginadorDto);
  }
          @Publico()
    @Get('descargar/sinComision')
    async descargarSinComision(@Res() response: Response) {
      const workbook = await this.servicioService.descargarServicioSinComision();
  
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


    @Publico()
    @Get('descargar/Comision')
    async descargarServicioComision(@Res() response: Response) {
      const workbook = await this.servicioService.descargarServicioComision();
  
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
  
}
