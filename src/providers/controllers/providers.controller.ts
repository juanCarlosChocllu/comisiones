import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ProvidersService } from '../services/providers.service';
import { DescargarProviderDto } from '../dto/create-provider.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multerConfig';
import { Publico } from 'src/autenticacion/decorators/publico';
import { ValidateIdPipe } from 'src/core/utils/validate-id.pipe';

@Controller('provider')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Publico()
  @Post('mia/venta')
  descargarVentas(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.guardardataVenta(descargarProviderDto);
  }

  @Publico()
  @Post('mia/venta/marca/actulizar')
  actualizaMarcaVenta(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.actualizaMarcaVenta(descargarProviderDto);
  }

  @Publico()
  @Post('mia/venta/anular')
  anularVentas(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.anularVentas(descargarProviderDto);
  }

  @Post('mia/venta/actualizar')
  actualizarDescuentos(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.actualizarDescuentos(descargarProviderDto);
  }

  @Post('excel/combinaciones/comisiones')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  guardarComisionesReceta(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    }
    return this.providersService.guardarComisionesReceta(file.filename);
  }

  @Post('excel/producto/comisiones')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  guardarComisionesProducto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    }

    return this.providersService.guardarComisionesProducto(file.filename);
  }

  @Post('excel/servicio/comisiones')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  guardarComisionesServicio(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException();
    }
    return this.providersService.guardarComisionesServicio(file.filename);
  }

  @Post('excel/combinaciones/comisiones/actualizar')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  actulizaComisiones(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException();
      }
      return this.providersService.actulizaComisiones(file.filename);
    } catch (error) {
      throw new BadRequestException();
    }
  }

/*  @Publico() // se usa para buscar el sctok por producro
  @Post('stock')
 async  stockProducto(@Body('producto', ValidateIdPipe) producto :string ){
    try {
      const response = await this.providersService.guardarStockMia(producto)
    } catch (error) {
       throw error
    }
  }*/
 
  @Publico()// se usa  para buscar el stock por un rango de fecha
  @Post('stock/Mia')
  descargarStockProductos(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.descargarStockProductos(descargarProviderDto);
  }
}
