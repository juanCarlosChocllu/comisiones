import { HttpStatus, Injectable } from '@nestjs/common';
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
@Injectable()
export class ProvidersService {
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
  ) {}
  async descargarVentasMia(createProviderDto: DescargarProviderDto) {
    try {
      const data: DescargarProviderDto = {
        fechaFin: createProviderDto.fechaFin,
        fechaInicio: createProviderDto.fechaInicio,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIyYTEyMTU5ZmZmMzAzYWY3ODkxNjYiLCJ1c2VybmFtZSI6Imthbm5hMiIsImlhdCI6MTczMzE0NTM0NCwiZXhwIjoxNzMzMTYzMzQ0fQ.p1wF-qQ_xLOjQ85vMFfxXCJBYEHgOqCcjmZ3YpU5Y2g',
      };

      const ventas = await firstValueFrom(
        this.httpService.post<VentaApiI[]>(
          //'https://comercial.opticentro.com.bo/api/ventas',
                   'http://localhost/opticentro/web/app_dev.php/api/ventas',
          data,
        ),
      );

      return await this.guardardataVenta(ventas.data);
    } catch (error) {
      console.log(error);
    }
  }

  private async guardardataVenta(ventas: VentaApiI[]) {
    let ventaGuardar: VentaI = {};
    for (const data of ventas) {
      const sucursal = await this.sucursalService.buscarSucursalPorNombre(
        data.local,
      );

      if (sucursal) {
        const [asesor, tipoVenta] = await Promise.all([
          this.asesorService.guardarAsesor(data.nombre_vendedor, sucursal._id),
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
          descuentoPromosion: data.descuentoPromosion,
          descuentoPromosion2: data.descuentoPromosion2,
          nombrePromosion: data.nombrePromosion,
          tipo: data.tipo,
          tipo2: data.tipo2,
          tipoDescuento: data.tipoDescuento,
          flag: data.flag,
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
    );

    if (producto) {
      const detalle: detalleVentaI = {
        cantidad: 1,
        producto: producto._id,
        importe: data.importe,
        rubro: data.rubro,
        venta: venta,
        marca: producto.marca,
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
      this.colorLenteService.verificarColorLente(data.atributo1),
      this.tipoLenteService.guardarTipoLente(data.atributo2),
      this.materialService.guardarMaterial(data.atributo3),
      this.tipoColorLenteService.verificarTipoColorLente(data.atributo4),
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
          data.precio
        );

      if (recetaCombinacion && venta) {
        //  const comision = await this.comisionRecetaService.listarComisionReceta(data.precio, recetaCombinacion._id)

        const detalle: detalleVentaI = {
          cantidad: 1,
          combinacionReceta: recetaCombinacion._id,
          importe: data.importe,
          rubro: data.rubro,
          venta: venta,
          // comision:comision.map((item => item.monto)),
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

  async guardarComisionesReceta(archivo:string) {
    const ruta=  this.rutaArchivoUpload(archivo)
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
            //comision: hoja.getCell(11).value,
            monto: hoja.getCell(11).value ? hoja.getCell(11).value :0,
          },
          {
            //comision: hoja.getCell(13).value,
            monto: hoja.getCell(12).value ? hoja.getCell(12).value :0,
          },
        ];
        const data: GuardarComisionRecetaI = {
          codigoMia: String(codigoMia),
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
     
        console.log(data);
        
        await this.combinacionRecetaService.guardarComisionrecetaCombinacion(
          data,
        );
      }

      break;
    }
    return {status:HttpStatus.CREATED}
  }

  async guardarComisionesProducto() {
    const workbook = this.hojaDeTrabajo('./upload/3.xlsx');
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

        const comisiones: comisionesI[] = [
          {
            comision: hoja.getCell(12).value,
            monto: hoja.getCell(13).value,
          },
          {
            comision: hoja.getCell(14).value,
            monto: hoja.getCell(15).value,
          },
        ];

        const data: productosExcelI = {
          codigoMia: String(codigoMia),
          categoria: String(categoria),
          color: String(color),
          marca: String(marca),
          serie: String(serie),
          comisiones: comisiones,
          codigoQR: String(codigoQr),
          tipoProducto: String(producto),
          precio: String(precio),
          tipoMontura: String(tipoMontura),
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
  async guardarComisionesServicio() {
    const workbook = this.hojaDeTrabajo('./upload/servicio.xlsx');
    let contador: number = 0;
    for await (const hojas of workbook) {
      for await (const hoja of hojas) {
        contador++;
        if (contador == 1) {
          continue;
        }
        const codigoMia = hoja.getCell(1).value;
        const nombre = hoja.getCell(2).value;
        const descripcion = hoja.getCell(3).value;
        const tipoPrecio = hoja.getCell(4).value;
        const monto = hoja.getCell(5).value;

        const comisiones: comisionesI[] = [
          {
            comision: hoja.getCell(6).value,
            monto: hoja.getCell(7).value,
          },
          {
            comision: hoja.getCell(8).value,
            monto: hoja.getCell(9).value,
          },
        ];
        const data: exceldataServicioI = {
          codigoMia: String(codigoMia),
          comisiones: comisiones,
          descripcion: String(descripcion),
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
    let ruta: string =this.rutaArchivoUpload(nombreArchivo)
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
          codigoMia: String(codigoMia),
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
        await this.comisionRecetaService.actulizarComisiones(data)
    
      }

      break;
    }
    return {status:HttpStatus.OK}
  }

  private rutaArchivoUpload(archivo:string) {
     let ruta: string = path.join(
      __dirname,
      `../../../upload/${archivo}`,
    );
    return ruta
  }
}
