import { HttpStatus, Injectable } from '@nestjs/common';
import { DescargarProviderDto } from '../dto/create-provider.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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
import { combinacionReceta } from 'src/combinacion-receta/intercafe/combinacionReceta';
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
    private readonly tipoMonturaService:TipoMonturaService,
    private readonly productoService:ProductoService,
    private readonly tipoVentaService:TipoVentaService,

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
          'https://comercial.opticentro.com.bo/api/ventas',
          data,
        ),
      );
  
   
      
      await this.guardardataVenta(ventas.data);
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
        const asesor = await this.asesorService.guardarAsesor(
          data.nombre_vendedor,
          sucursal._id
        );
        const tipoVenta = await this.tipoVentaService.guardarTipoVenta(data.tipoVenta)

        ventaGuardar={
          asesor:asesor._id,
          comisiona:data.comisiona,
          descuento:data.descuentoFicha,
          id_venta:data.idVenta,
          montoTotal:data.monto_total,
          sucursal:sucursal._id,
          tipoVenta:tipoVenta._id,
          descuentoPromosion:data.descuentoPromosion,
          descuentoPromosion2:data.descuentoPromosion2,
          nombrePromosion:data.nombrePromosion,
          tipo:data.tipo,
          tipo2:data.tipo2,
          tipoDescuento:data.tipoDescuento,
          flag:data.flag,
          fechaVenta:new Date(data.fecha),
          ...(data.fecha_finalizacion) && {fechaFinalizacion:new Date(data.fecha_finalizacion)}
        }
        const venta = await this.ventaService.guardarVenta(ventaGuardar)
        if (data.rubro === productoE.lente) {
          const coloLente = await this.colorLenteService.verificarColorLente(
            data.atributo1,
          );
          const tipoLente = await this.tipoLenteService.guardarTipoLente(
            data.atributo2,
          );
          const material = await this.materialService.guardarMaterial(
            data.atributo3,
          );

          const tipoColorLente =
            await this.tipoColorLenteService.verificarTipoColorLente(
              data.atributo4,
            );

          const marca = await this.marcaLenteService.guardarMarcaLente(
            data.atributo5,
          );

          const tratamiento = await this.tratamientoService.guardarTratamiento(
            data.atributo6,
          );
          
          const rango = await this.rangoService.guardarRangoLente(data.atributo7);
          
          
          if (
            !!coloLente &&
            !!tipoLente &&
            !!material &&
            !!tipoColorLente &&
            !!marca &&
            !!rango&&
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
              );
           
              
        
              if(recetaCombinacion && venta){
                const detalle:detalleVentaI={
                  cantidad:1,
                  combinacionReceta:recetaCombinacion._id,
                  importe:data.importe, 
                  rubro:data.rubro,
                  venta:venta._id,
              }
                await this.ventaService.tieneReceta(venta._id, true)
                await this.detalleVentaService.guardarDetalleVenta(detalle)
              }
                    
          }

          
        } else {
    
          
        const producto =   await this.productoService.verificarProducto(data.atributo1, data.rubro)
        
        console.log(producto);
        
        if(producto){
          const detalle:detalleVentaI={
            cantidad:1,
            producto:producto._id,
            importe:data.importe, 
            rubro:data.rubro,
            venta:venta._id,
        }
          const p = await this.ventaService.tieneProducto(venta._id, true)
          console.log(p);
          
          await this.detalleVentaService.guardarDetalleVenta(detalle)
        }
          
          // console.log(data);
        }
       

    
      }
    }
    return {status:HttpStatus.CREATED}
  }

  findAll() {
    return `This action returns all providers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} provider`;
  }

  remove(id: number) {
    return `This action removes a #${id} provider`;
  }
}
