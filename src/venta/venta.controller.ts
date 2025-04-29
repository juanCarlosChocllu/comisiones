import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VentaService } from './services/venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { BuscadorVentaDto } from './dto/buscadorVenta.dto,';
import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}


  @Post()
  listdarVentas(@Body() buscadorVentaDto:BuscadorVentaDto) {
    return this.ventaService.listarVentas( buscadorVentaDto);
  }

  @Get('detalle/:asesor/:fechaInicio/:fechaFin')
  findOne(
    @Param('asesor', ValidateIdPipe) asesor:Types.ObjectId,
    @Param('fechaInicio') fechaInicio:string,
    @Param('fechaFin') fechaFin:string
 ) {
    return this.ventaService.ventaConSusComiones(asesor,fechaInicio, fechaFin);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventaService.update(+id, updateVentaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ventaService.remove(+id);
  }



  guardarVenta() {
    
  }
}
