import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DescargarProviderDto } from '../dto/create-provider.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, iif } from 'rxjs';

import { MaterialService } from 'src/material/material.service';
import { ColorLenteService } from 'src/color-lente/color-lente.service';
import { MarcaLenteModule } from 'src/marca-lente/marca-lente.module';
import { MarcaLenteService } from 'src/marca-lente/marca-lente.service';
import { RangoModule } from 'src/rango/rango.module';
import { RangoService } from 'src/rango/rango.service';

import { TipoColorLenteService } from 'src/tipo-color-lente/tipo-color-lente.service';
import { TipoColorLente } from 'src/tipo-color-lente/schema/tipoColorLente.schema';
import { TipoLenteService } from 'src/tipo-lente/tipo-lente.service';
import { productoE } from '../enum/productos';
import { AsesorService } from 'src/asesor/asesor.service';
import {
  combinacionReceta,
  comisionesI,
  GuardarComisionRecetaI,
} from 'src/combinacion-receta/interface/combinacionReceta';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { VentaI } from 'src/venta/interface/venta';
import { Types } from 'mongoose';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { VentaService } from 'src/venta/services/venta.service';
import { TratamientoService } from 'src/tratamiento/services/tratamiento.service';
import { DetalleVentaService } from 'src/venta/services/detallleVenta.service';
import { detalleVentaI } from 'src/venta/interface/detalleVenta';
import { ColorService } from 'src/color/color.service';
import { MarcaService } from 'src/marca/marca.service';
import { TipoMonturaService } from 'src/tipo-montura/tipo-montura.service';
import { ProductoService } from 'src/producto/producto.service';
import { TipoVentaService } from 'src/tipo-venta/tipo-venta.service';
import * as ExcelJS from 'exceljs';
import {
  DataProductoI,
  productosExcelI,
} from 'src/producto/interface/dataProducto';
import { ComisionRecetaService } from 'src/comision-receta/comision-receta.service';
import { ComisionProducto } from 'src/comision-producto/schema/comision-producto.schema';
import { ComisionProductoService } from 'src/comision-producto/comision-producto.service';
import { exceldataServicioI } from 'src/servicio/interface/servicio.interface';
import { ServicioService } from 'src/servicio/servicio.service';
import * as path from 'path';
import { apiMia, tokenMia } from 'src/core/config/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DateTime } from 'luxon';
import { LogDescargaService } from 'src/log-descarga/log-descarga.service';
import { flag } from 'src/core/enum/flag';
import { AnularVentaMiaI, VentaApiI } from '../interface/venta';
import { AnularVentaDto } from 'src/venta/dto/AnularVenta.dto';
import { StockMia } from '../interface/stockMia';
import { AxiosResponse } from 'axios';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class ProvidersService {
  private readonly logger = new Logger(ProductoService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly tratamientoService: TratamientoService,
    private readonly materialService: MaterialService,
    private readonly colorLenteService: ColorLenteService,
    private readonly marcaLenteService: MarcaLenteService,
    private readonly rangoService: RangoService,
    private readonly tipoColorLenteService: TipoColorLenteService,
    private readonly tipoLenteService: TipoLenteService,
    private readonly asesorService: AsesorService,
    private readonly combinacionRecetaService: CombinacionRecetaService,
    private readonly sucursalService: SucursalService,
    private readonly ventaService: VentaService,
    private readonly detalleVentaService: DetalleVentaService,
    private readonly colorService: ColorService,
    private readonly marcaService: MarcaService,
    private readonly tipoMonturaService: TipoMonturaService,
    private readonly productoService: ProductoService,
    private readonly tipoVentaService: TipoVentaService,
    private readonly comisionRecetaService: ComisionRecetaService,
    private readonly comisionProductoService: ComisionProductoService,
    private readonly servicioService: ServicioService,
    private readonly logDescargaService: LogDescargaService,
    private readonly stockService: StockService,
  ) {}
  async descargarVentasMia(createProviderDto: DescargarProviderDto) {
    try {
      const data: DescargarProviderDto = {
        fechaFin: createProviderDto.fechaFin,
        fechaInicio: createProviderDto.fechaInicio,
        token: tokenMia,
      };
      const ventas= await firstValueFrom(
        this.httpService.post<VentaApiI[]>(`${apiMia}/api/ventas`, data),
      );
      await this.logDescargaService.registrarLogDescarga(
        'Venta',
        createProviderDto.fechaFin,
      );
      return ventas.data;
    } catch (error) {
      throw error;
    }
  }

  async descargarStockMia(producto:string):Promise<StockMia[]>{
     try {
      const data ={
        producto:producto,
        token:tokenMia
      }      
     const stock:AxiosResponse<StockMia[]>= await firstValueFrom(this.httpService.post(`${apiMia}/api/stock`, data))
      return stock.data
    } catch (error) {
      throw error;
    }
  }



   public async guardarStockMia(id:string){
    const stock = await this.descargarStockMia(id)
    await this.stockService.guardarStockMia(stock)
    
   }

  async anularVentasMia(createProviderDto: DescargarProviderDto) {
    try {
      const data: DescargarProviderDto = {
        fechaFin: createProviderDto.fechaFin,
        fechaInicio: createProviderDto.fechaInicio,
        token: tokenMia,
      };
      const ventas = await firstValueFrom(
        this.httpService.post<AnularVentaMiaI[]>(
          `${apiMia}/api/ventas/anuladas`,
          data,
        ),
      );
      await this.logDescargaService.registrarLogDescarga(
        'Venta',
        createProviderDto.fechaFin,
      );
      return ventas.data;
    } catch (error) {
      throw error;
    }
  }

  async guardardataVenta(createProviderDto: DescargarProviderDto) {
    try {
      console.log('descargando venta');

      let ventaGuardar: VentaI = {};
      const ventas: VentaApiI[] =
        await this.descargarVentasMia(createProviderDto);
      for (const data of ventas) {
        const sucursal = await this.sucursalService.buscarSucursalPorNombre(
          data.local,
        );

        if (sucursal) {
          const [asesor, tipoVenta] = await Promise.all([
            this.asesorService.guardarAsesor(
              data.nombre_vendedor,
              sucursal._id,
            ),
            this.tipoVentaService.guardarTipoVenta(data.tipoVenta),
          ]);

          ventaGuardar = {
            asesor: asesor._id,
            comisiona: data.comisiona,
            descuento: data.descuentoFicha,
            id_venta: data.idVenta,
            montoTotal: data.monto_total,
            sucursal: sucursal._id,
            tipoVenta: tipoVenta._id,
            estadoTracking:data.estadoTracking,
            descuentoPromosion: data.descuentoPromosion,
            descuentoPromosion2: data.descuentoPromosion2,
            nombrePromosion: data.nombrePromosion,
            tipo: data.tipo,
            tipo2: data.tipo2,
            tipoDescuento: data.tipoDescuento,
            flag: data.flag,
            precioTotal: data.precioTotal,
            precio: data.precio, // se veridica en cada venta

            fechaVenta: new Date(data.fecha),
            ...(data.fecha_finalizacion && {
              fechaFinalizacion: new Date(data.fecha_finalizacion),
            }),
          };
          const venta = await this.ventaService.guardarVenta(ventaGuardar);
          if (data.rubro === productoE.lente) {
            await this.guardarLente(data, venta._id);
          } else if (
            data.rubro === productoE.gafa ||
            data.rubro === productoE.lenteDeContacto ||
            data.rubro === productoE.montura
          ) {
            await this.guardarProducto(data, venta._id);
          } else if (data.rubro == productoE.servicio) {
            await this.guardarServicio(data, venta._id);
          } else {
            await this.guadarOtroProducto(data, venta._id);
          }
        } else {
          console.log('sin sucursal');
        }
      }

      return { status: HttpStatus.CREATED };
    } catch (error) {
      throw error;
    }
  }

  private async guadarOtroProducto(data: VentaApiI, venta: Types.ObjectId) {
    const detalle: detalleVentaI = {
      cantidad: 1,
      importe: data.importe,
      rubro: data.rubro,
      venta: venta._id,
      descripcion: data.descripcionProducto,
    };
    await this.detalleVentaService.guardarDetalleVenta(detalle);
    await this.ventaService.tipoPrecio(venta._id, data.precio);
  }

  private async guardarServicio(data: VentaApiI, venta: Types.ObjectId) {
    const servicio = await this.servicioService.buscarServicio(
      data.codProducto,
      data.precio,
    );
    if (servicio) {
      const detalle: detalleVentaI = {
        cantidad: 1,
        importe: data.importe,
        rubro: data.rubro,
        venta: venta._id,
        descripcion: data.descripcionProducto,
        servicio: servicio._id,
      };
      await this.detalleVentaService.guardarDetalleVenta(detalle);
      await this.ventaService.tipoPrecio(venta._id, data.precio);
    } else {
      const servicio = await this.servicioService.crearServicio(
        data.descripcionProducto,
        data.codProducto,
        data.precio,
        data.importe,
        data.descripcionProducto,
      );
      const detalle: detalleVentaI = {
        cantidad: 1,
        importe: data.importe,
        rubro: data.rubro,
        venta: venta._id,
        descripcion: data.descripcionProducto,
        servicio: servicio._id,
      };
      await this.detalleVentaService.guardarDetalleVenta(detalle);
      await this.ventaService.tipoPrecio(venta._id, data.precio);
    }
  }

  private async guardarProducto(data: VentaApiI, venta: Types.ObjectId) {
    const producto = await this.productoService.verificarProducto(
      data.codProducto,
      data.precio,
    );

    if (producto) {
      const detalle: detalleVentaI = {
        cantidad: 1,
        producto: producto._id,
        importe: data.importe,
        rubro: data.rubro,
        venta: venta,
        marca: data.atributo1,
        descripcion: data.descripcionProducto,
      };
      await this.ventaService.tieneProducto(venta, true);
      await this.detalleVentaService.guardarDetalleVenta(detalle);
    } else {
      const dataProducto: productosExcelI = {
        categoria: data.atributo3,
        codigoQR: data.atributo6,
        serie: data.atributo7,
        codigoMia: data.codProducto,
        color: data.atributo5,
        marca: data.atributo1,
        precio: data.precio,
        importe: data.importe,
        tipoProducto: data.rubro,
        tipoMontura: data.atributo4,
      };
      const producto = await this.productoService.guardarProducto(dataProducto);

      const detalle: detalleVentaI = {
        cantidad: 1,
        producto: producto._id,
        importe: data.importe,
        rubro: data.rubro,
        venta: venta,
        marca: data.atributo1,
        descripcion: data.descripcionProducto,
      };
      await this.ventaService.tieneProducto(venta, true);
      await this.detalleVentaService.guardarDetalleVenta(detalle);
    }
  }

  private async guardarLente(data: VentaApiI, venta: Types.ObjectId) {
    const [
      coloLente,
      tipoLente,
      material,
      tipoColorLente,
      marca,
      tratamiento,
      rango,
    ] = await Promise.all([
      this.colorLenteService.guardarColorLente(data.atributo1),
      this.tipoLenteService.guardarTipoLente(data.atributo2),
      this.materialService.guardarMaterial(data.atributo3),
      this.tipoColorLenteService.guardarTipoColorLente(data.atributo4),
      this.marcaLenteService.guardarMarcaLente(data.atributo5),
      this.tratamientoService.guardarTratamiento(data.atributo6),
      this.rangoService.guardarRangoLente(data.atributo7),
    ]);

    if (
      !!coloLente &&
      !!tipoLente &&
      !!material &&
      !!tipoColorLente &&
      !!marca &&
      !!rango &&
      !!tratamiento
    ) {
      const recetaCombinacion =
        await this.combinacionRecetaService.verificarCombinacion(
          tratamiento._id,
          material._id,
          marca._id,
          coloLente._id,
          rango._id,
          tipoLente._id,
          tipoColorLente._id,
          data.precio,
        );

      if (recetaCombinacion && venta) {
        const detalle: detalleVentaI = {
          medioPar: data.medioPar,
          cantidad: 1,
          combinacionReceta: recetaCombinacion._id,
          importe: data.importe,
          rubro: data.rubro,
          venta: venta,

          descripcion: `${material.nombre}/${tipoLente.nombre}/${tipoColorLente.nombre}/${tratamiento.nombre}/${rango.nombre}/${marca.nombre}/${coloLente.nombre}`,
        };
        await this.ventaService.tieneReceta(venta, true);
        await this.detalleVentaService.guardarDetalleVenta(detalle);
      } else {
        const codigo = this.combinacionRecetaService.generarCodigo(
          tratamiento.nombre,
          material.nombre,
          marca.nombre,
          coloLente.nombre,
          rango.nombre,
          tipoColorLente.nombre,
          tipoColorLente.nombre,
        );
        const recetaCombinacion =
          await this.combinacionRecetaService.crearCombinacion(
            tratamiento._id,
            material._id,
            marca._id,
            coloLente._id,
            rango._id,
            tipoLente._id,
            tipoColorLente._id,
            codigo,
            data.precio,
            data.importe,
          );
        if (recetaCombinacion._id && venta) {
          const detalle: detalleVentaI = {
            cantidad: 1,
            combinacionReceta: recetaCombinacion._id,
            importe: data.importe,
            rubro: data.rubro,
            venta: venta,
            descripcion: `${material.nombre}/${tipoLente.nombre}/${tipoColorLente.nombre}/${tratamiento.nombre}/${rango.nombre}/${marca.nombre}/${coloLente.nombre}`,
          };
          await this.ventaService.tieneReceta(venta, true);
          await this.detalleVentaService.guardarDetalleVenta(detalle);
        }
      }
    }
  }

  async guardarComisionesReceta(archivo: string) {
    const ruta = this.rutaArchivoUpload(archivo);
    const workbook = this.hojaDeTrabajo(ruta);
    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador === 1) continue;
        const codigoMia = hoja.getCell(1).value;
        const meterial = hoja.getCell(2).value;
        const tipoLente = hoja.getCell(3).value;
        const tipoColor = hoja.getCell(4).value;

        const tratamiento = hoja.getCell(5).value;

        const rangos = hoja.getCell(6).value;
        const marca = hoja.getCell(7).value;

        const colorLente = hoja.getCell(8).value;
        const precio = hoja.getCell(9).value;
        const monto = hoja.getCell(10).value;

        if (
          !meterial &&
          !tipoLente &&
          !tipoColor &&
          !tratamiento &&
          !rangos &&
          !marca &&
          !colorLente &&
          !precio
        )
          continue;

        const comisiones: comisionesI[] = [
          {
            //comision: hoja.getCell(11).value,
            monto: hoja.getCell(11).value ? hoja.getCell(11).value : 0,
          },
          {
            //comision: hoja.getCell(13).value,
            monto: hoja.getCell(12).value ? hoja.getCell(12).value : 0,
          },
        ];
        const data: GuardarComisionRecetaI = {
          codigoMia: String(codigoMia).trim(),
          colorLente: String(colorLente).toUpperCase().trim(),
          comisiones: comisiones,
          marcaLente: String(marca).toUpperCase().trim(),
          material: String(meterial).toUpperCase().trim(),
          rango: String(rangos).toUpperCase().trim(),
          tipoColorLente: String(tipoColor).toUpperCase().trim(),
          tipoLente: String(tipoLente).toUpperCase().trim(),
          tratamiento: String(tratamiento).toUpperCase().trim(),
          precio: String(precio).toUpperCase().trim(),
          monto: monto ? Number(monto) : 0,
        };

        await this.combinacionRecetaService.guardarComisionrecetaCombinacion(
          data,
        );
      }

      break;
    }
    return { status: HttpStatus.CREATED };
  }

  async guardarComisionesProducto(archivo: string) {
    const ruta = this.rutaArchivoUpload(archivo);
    const workbook = this.hojaDeTrabajo(ruta);
    let contador: number = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador == 1) {
          continue;
        }
        const codigoMia = hoja.getCell(1).value;
        const codigoQr = hoja.getCell(2).value;
        const producto = hoja.getCell(3).value;
        const marca = hoja.getCell(4).value;
        const color = hoja.getCell(5).value;
        const serie = hoja.getCell(6).value;
        //const genero = hoja.getCell(7).value;
        const tipoMontura = hoja.getCell(7).value;
        // const categoria = hoja.getCell(9).value;
        const precio = hoja.getCell(8).value;
        const monto = hoja.getCell(9).value;

        const comisiones: comisionesI[] = [
          {
            //comision: hoja.getCell(12).value,
            monto: hoja.getCell(10).value,
          },
          {
            //comision: hoja.getCell(14).value,
            monto: hoja.getCell(11).value,
          },
        ];

        const data: productosExcelI = {
          codigoMia: String(codigoMia).trim(),
          color: String(color).trim(),
          marca: String(marca).trim(),
          serie: String(serie).trim(),
          comisiones: comisiones,
          codigoQR: String(codigoQr).trim(),
          tipoProducto: String(producto).trim(),
          importe: Number(monto),
          precio: String(precio).trim(),
          tipoMontura: String(tipoMontura).trim(),
        };

        await this.productoService.guardaProductoComisiones(data);
      }
      break;
    }

    return { status: HttpStatus.OK };
  }

  async guardarComisionesProducto1() {
    const workbook = this.hojaDeTrabajo('./upload/2.xlsx');
    let contador: number = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador == 1) {
          continue;
        }
        const codigoMia = hoja.getCell(1).value;
        const codigoQr = hoja.getCell(2).value;
        const producto = hoja.getCell(3).value;
        const marca = hoja.getCell(4).value;
        const color = hoja.getCell(5).value;
        const serie = hoja.getCell(6).value;
        const genero = hoja.getCell(7).value;
        const tipoMontura = hoja.getCell(8).value;
        const categoria = hoja.getCell(9).value;
        const precio = hoja.getCell(10).value;

        const data: productosExcelI = {
          codigoMia: String(codigoMia),
          categoria: String(categoria),
          color: String(color),
          marca: String(marca),
          serie: String(serie),

          codigoQR: String(codigoQr),
          tipoProducto: String(producto),
          precio: String(precio),
          tipoMontura: String(tipoMontura),
        };
        await this.productoService.guardaProductoExcel(data);
      }
    }
  }
  async guardarComisionesServicio(nombreArchivo: string) {
    let ruta: string = this.rutaArchivoUpload(nombreArchivo);
    const workbook = this.hojaDeTrabajo(ruta);
    let contador: number = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador == 1) {
          continue;
        }
        const codigoMia = hoja.getCell(1).value;
        const nombre = hoja.getCell(2).value;

        const tipoPrecio = hoja.getCell(3).value;
        const monto = hoja.getCell(4).value;

        const comisiones: comisionesI[] = [
          {
            monto: hoja.getCell(5).value,
          },
          {
            monto: hoja.getCell(6).value,
          },
        ];
        const data: exceldataServicioI = {
          codigoMia: String(codigoMia),
          comisiones: comisiones,
          nombre: String(nombre),
          tipoPrecio: String(tipoPrecio),
          monto: Number(monto),
        };

        await this.servicioService.guardarServicioConSusCOmisiones(data);
      }
    }
    return { status: HttpStatus.OK };
  }
  private hojaDeTrabajo(ruta: string) {
    const workbook = new ExcelJS.stream.xlsx.WorkbookReader(ruta, {
      entries: 'emit',
    });
    return workbook;
  }

  async actulizaComisiones(nombreArchivo: string) {
    let ruta: string = this.rutaArchivoUpload(nombreArchivo);
    const workbook = this.hojaDeTrabajo(ruta);
    let contador = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador === 1) continue;
        const codigoMia = hoja.getCell(1).value;
        const meterial = hoja.getCell(2).value;
        const tipoLente = hoja.getCell(3).value;
        const tipoColor = hoja.getCell(4).value;

        const tratamiento = hoja.getCell(5).value;

        const rangos = hoja.getCell(6).value;
        const marca = hoja.getCell(7).value;

        const colorLente = hoja.getCell(8).value;
        const precio = hoja.getCell(9).value;
        const monto = hoja.getCell(10).value;
        const comisiones: comisionesI[] = [
          {
            monto: hoja.getCell(11).value,
          },
          {
            monto: hoja.getCell(12).value,
          },
        ];
        const data: GuardarComisionRecetaI = {
          codigoMia: String(codigoMia).trim(),
          colorLente: String(colorLente).toUpperCase().trim(),
          comisiones: comisiones,
          marcaLente: String(marca).toUpperCase().trim(),
          material: String(meterial).toUpperCase().trim(),
          rango: String(rangos).toUpperCase().trim(),
          tipoColorLente: String(tipoColor).toUpperCase().trim(),
          tipoLente: String(tipoLente).toUpperCase().trim(),
          tratamiento: String(tratamiento).toUpperCase().trim(),
          precio: String(precio).toUpperCase().trim(),
          monto: Number(monto),
        };
        await this.comisionRecetaService.actulizarComisiones(data);
      }

      break;
    }
    return { status: HttpStatus.OK };
  }

  private rutaArchivoUpload(archivo: string) {
    let ruta: string = path.join(__dirname, `../../../upload/${archivo}`);
    return ruta;
  }

  @Cron(CronExpression.EVERY_DAY_AT_4PM)
  async handleCron() {
    const date = new Date();

    const fechaAyer = new Date(date);
    fechaAyer.setDate(date.getDate() - 1);

    const año = fechaAyer.getFullYear();
    const mes = (fechaAyer.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaAyer.getDate().toString().padStart(2, '0');

    const fecha: DescargarProviderDto = {
      fechaInicio: `${año}-${mes}-${dia}`,
      fechaFin: `${año}-${mes}-${dia}`,
    };
    // console.log(fecha);

    this.logger.debug('Iniciando la descarga');
    await this.guardardataVenta(fecha);
  }

  async actualizarDescuentos(createProviderDto: DescargarProviderDto) {
    try {
      const data: VentaApiI[] =
        await this.descargarVentasMia(createProviderDto);

      for (const venta of data) {
        await this.ventaService.actulizarDescuento(venta);
      }

      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async finalizarVentasCron() {
    const hoy = new Date();

    const fechaFinDate = new Date(hoy);
    fechaFinDate.setDate(hoy.getDate() - 1);

    const fechaInicioDate = new Date(hoy);
    fechaInicioDate.setDate(hoy.getDate() - 2);

    const formatearFecha = (fecha: Date): string => {
      const año = fecha.getFullYear();
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const dia = fecha.getDate().toString().padStart(2, '0');
      return `${año}-${mes}-${dia}`;
    };

    const fecha: DescargarProviderDto = {
      fechaInicio: formatearFecha(fechaInicioDate),
      fechaFin: formatearFecha(fechaFinDate),
    };
    this.logger.debug('Iniciando las finalizaciones');
    await this.actualizarDescuentos(fecha);
  }

  async anularVentas(createProviderDto: DescargarProviderDto) {
    const ventas = await this.anularVentasMia(createProviderDto);
    for (const venta of ventas) {
      const data: AnularVentaDto = {
        estado: venta.estado,
        estadoTracking: venta.estadoTracking,
        fechaAnulacion: venta.fechaAprobacionAnulacion,
        idVenta: venta.id_venta,
      };

      await this.ventaService.anularVenta(data);
    }
    return { status: HttpStatus.OK };
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async anularVentasCron() {
    try {
      const hoy = new Date();
      const fechaFinDate = new Date(hoy);
      fechaFinDate.setDate(hoy.getDate() - 1);

      const fechaInicioDate = new Date(hoy);
      fechaInicioDate.setDate(hoy.getDate() - 5);

      const formatearFecha = (fecha: Date): string => {
        const año = fecha.getFullYear();
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        return `${año}-${mes}-${dia}`;
      };

      const fecha: DescargarProviderDto = {
        fechaInicio: formatearFecha(fechaInicioDate),
        fechaFin: formatearFecha(fechaFinDate),
      };

      this.logger.debug('Iniciando la anulaciones');
      const response = await this.anularVentas(fecha);
      console.log(fecha);
    } catch (error) {
      console.log(error);
    }
  }

  async actualizaMarcaVenta(descargarProviderDto: DescargarProviderDto) {
    const ventas = await this.descargarVentasMia(descargarProviderDto);
    for (const venta of ventas) {
      if (venta.rubro == 'MONTURA') {
        console.log(venta.rubro, venta.atributo1);

        const ventaEncontrada = await this.ventaService.buscarVenta(
          venta.idVenta,
        );
        if (ventaEncontrada && ventaEncontrada.length > 0) {
          for (const detalle of ventaEncontrada) {
            if (detalle.rubro == 'MONTURA') {
              const producto = await this.productoService.buscarProducto(
                detalle.producto,
              );
              if (producto) {
                await this.marcaService.actulizarMarca(
                  producto.marca,
                  venta.atributo1,
                );
              }
            }
          }
        }
       
      }
    }
  }
}
