import { Injectable } from '@nestjs/common';
import { DescargarProviderDto } from '../dto/create-provider.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { TratamientoService } from 'src/tratamiento/tratamiento.service';
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
import { VentagGuardar } from 'src/venta/interface/venta';

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
    private readonly asesorService: AsesorService
    
  ) {}
  async descargarVentasMia(createProviderDto: DescargarProviderDto) {
    try {
      const data: DescargarProviderDto = {
        fechaFin: createProviderDto.fechaInicio,
        fechaInicio: createProviderDto.fechaFin,
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzIyYTEyMTU5ZmZmMzAzYWY3ODkxNjYiLCJ1c2VybmFtZSI6Imthbm5hMiIsImlhdCI6MTczMzE0NTM0NCwiZXhwIjoxNzMzMTYzMzQ0fQ.p1wF-qQ_xLOjQ85vMFfxXCJBYEHgOqCcjmZ3YpU5Y2g',
      };
      const ventas = await firstValueFrom(
        this.httpService.post<VentaI[]>(
          'https://comercial.opticentro.com.bo/api/ventas',
          data,
        ),
      );
      await this.guardardataVenta(ventas.data)
     
    } catch (error) {
      console.log(error);
    }
  }


  private async guardardataVenta(ventas:VentaI[]){

    for (const venta of ventas) {      
      if(venta.rubro == productoE.lente) {
        await  this.guardarAtributoslente(venta.atributo1,venta.atributo2, venta.atributo3, venta.atributo4, venta.atributo5, venta.atributo6)
      }
      await this.asesorService.guardarAsesor(venta.nombre_vendedor)
    }
  }

  private async  guardarAtributoslente(atributo1:string, atributo2:string,atributo3:string, atributo4:string ,atributo5:string, atributo6:string){
    await Promise.all([
      this.colorLenteService.guardarColorLente(atributo1),
      this.tipoLenteService.guardarTipoLente(atributo2),
      this.materialService.guardarMaterial(atributo3),
      this.tipoColorLenteService.guardarTipoColorLente(atributo4),
      this.marcaLenteService.guardarMarcaLente(atributo5),
      this.tratamientoService.guardarTratamiento(atributo6)

   ])
    
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
