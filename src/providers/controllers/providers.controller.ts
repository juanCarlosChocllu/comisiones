import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, NotFoundException } from '@nestjs/common';
import { ProvidersService } from '../services/providers.service';
import { DescargarProviderDto } from '../dto/create-provider.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multerConfig';
import { Publico } from 'src/autenticacion/decorators/publico';


@Controller('provider')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}
@Publico()
  @Post('mia/venta')
  descargarVentas(@Body() descargarProviderDto: DescargarProviderDto) {
    return this.providersService.descargarVentasMia(descargarProviderDto);
  }
 
  @Post('excel/combinaciones/comisiones')
  @UseInterceptors(FileInterceptor('file',multerConfig))
  guardarComisionesReceta(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException(); 
    }
    return this.providersService.guardarComisionesReceta(file.filename)
  }

  @Post('excel/producto/comisiones')
  @UseInterceptors(FileInterceptor('file',multerConfig))
  guardarComisionesProducto(@UploadedFile() file: Express.Multer.File){
    if(!file){
      throw new BadRequestException(); 
    }
    
    return this.providersService.guardarComisionesProducto(file.filename)
  }

  @Post('excel/servicio/comisiones')
  guardarComisionesServicio(){
    return this.providersService.guardarComisionesServicio()
  }
  
    @Post('excel/combinaciones/comisiones/actualizar')
    @UseInterceptors(FileInterceptor('file',multerConfig))
    actulizaComisiones(@UploadedFile() file: Express.Multer.File){
    try {      
      if(!file){
      throw new BadRequestException(); 
    } 
      return this.providersService.actulizaComisiones(file.filename)
    } catch (error) {
      throw new BadRequestException()
    }
    
  }
}
