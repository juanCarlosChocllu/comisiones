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
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { productoE } from 'src/providers/enum/productos';
import { BuscadorProductoDto } from './dto/BuscadorProducto.dto';
import { CrearProductoDto } from './dto/crearProduto.dto';
import { Publico } from 'src/autenticacion/decorators/publico';
import { Response } from 'express';
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}
  @Publico()
  @Post('sincronizar')
  crearProducto(@Body() CrearProductoDto: CrearProductoDto) {
    return this.productoService.crearProducto(CrearProductoDto);
  }
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }
  @Get('montura')
  listarMontura(@Query() BuscadorProductoDto: BuscadorProductoDto) {
    return this.productoService.listarProductos(
      BuscadorProductoDto,
      productoE.montura,
    );
  }
  @Get('gafa')
  listarGafa(@Query() BuscadorProductoDto: BuscadorProductoDto) {
    return this.productoService.listarProductos(
      BuscadorProductoDto,
      productoE.gafa,
    );
  }
  @Get('lente/contacto')
  listarDeContato(@Query() BuscadorProductoDto: BuscadorProductoDto) {
    return this.productoService.listarProductos(
      BuscadorProductoDto,
      productoE.lenteDeContacto,
    );
  }


  @Get('sinComision/montura')
  listarMonturaSinComision(
  
    ) {
      
    return this.productoService.productoListarSinComision(productoE.montura);
    }
 
  @Get('sinComision/lente/contacto')
  listarLcSinComision(
  ) {
    return this.productoService.productoListarSinComision(productoE.lenteDeContacto);
  }
       
    @Get('sinComision/gafa')
    listarGafaSinComision(
    ) {
    return this.productoService.productoListarSinComision(productoE.gafa);
    }


   @Get('descargar/montura/sinComsion')
  async descargarMonturaSinComision(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductoSinComision(productoE.montura);

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
    
    @Get('descargar/lc/sinComsion')
  async descargarLcSinComision(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductoSinComision(productoE.lenteDeContacto);

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
      
    @Get('descargar/gafa/sinComsion')
  async descargarGafaSinComision(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductoSinComision(productoE.gafa);

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


  @Get('descargar/montura')
  async descargarMontura(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductos(
      productoE.montura,
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

  @Get('descargar/gafa')
  async descargarGafa(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductos(
      productoE.gafa,
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

    @Get('descargar/lc')
  async descargarlc(@Res() response: Response) {
    const workbook = await this.productoService.descargarProductos(
      productoE.lenteDeContacto,
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
}
