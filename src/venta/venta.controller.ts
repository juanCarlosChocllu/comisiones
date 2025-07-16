import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentaService } from './services/venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { BuscadorVentaDto } from './dto/buscadorVenta.dto,';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { Publico } from 'src/autenticacion/decorators/publico';
import { FinalizarVentaDto } from './dto/FinalizarVentaDto';
import { AnularVentaDto } from './dto/AnularVenta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}


  @Post()
  listdarVentas(@Body() buscadorVentaDto:BuscadorVentaDto) {
    return this.ventaService.listasVentasComisiones( buscadorVentaDto);
  }

 /* @Get('detalle/:asesor/:fechaInicio/:fechaFin')
  findOne(
    @Param('asesor', ValidateIdPipe) asesor:Types.ObjectId,
    @Param('fechaInicio') fechaInicio:string,
    @Param('fechaFin') fechaFin:string
 ) {
    return this.ventaService.ventaConSusComiones(asesor,fechaInicio, fechaFin);
  }*/


  @Publico()
  @Post('finalizar')
   async finalizarVentas(@Body() finalizarVentaDto: FinalizarVentaDto){
    return this.ventaService.finalizarVentas(finalizarVentaDto)
   }

    @Publico()
    @Post('anular')
   async anularVenta(@Body() anularVentaDto: AnularVentaDto) {
    return this.ventaService.anularVenta(anularVentaDto);
  }
}
