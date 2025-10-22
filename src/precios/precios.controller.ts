import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PreciosService } from './service/precios.service';
import { CreatePrecioDto } from './dto/create-precio.dto';
import { UpdatePrecioDto } from './dto/update-precio.dto';

import { Types } from 'mongoose';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';
import { ListarPrecioSucursalDto } from './dto/listarPrecioSucursal';

@Controller('precios')
export class PreciosController {
  constructor(private readonly preciosService: PreciosService) {}

  @Get()
  listar() {
    return this.preciosService.listar();
  }

  @Get('combinacion/:id')
   precioCombinacion(@Param('id') id: Types.ObjectId) {
    return this.preciosService.precioCombinacion(id);
  }

  @Get('producto/:id')
  precioProducto(@Param('id') id: Types.ObjectId) {
    return this.preciosService.precioProducto(id);
  }
  @Get('servicio/:id')
  precioServicio(@Param('id') id: Types.ObjectId) {
    return this.preciosService.precioServicio(id);
  }

  @Post('sucursal')
  listarPreciosPorSucursal(@Body() ListarPrecioSucursalDto:ListarPrecioSucursalDto){
    return this.preciosService.listarPreciosPorSucursal(ListarPrecioSucursalDto)
  }
}
