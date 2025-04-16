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
;
import { combinacionReceta } from 'src/combinacion-receta/intercafe/combinacionReceta';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { VentaGuardar } from 'src/venta/interface/venta';

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
    private readonly  combinacionRecetaService: CombinacionRecetaService
    
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

    for (const data of ventas) {      
      let ventaGuardar:VentaGuardar={}
     const asesor= await this.asesorService.guardarAsesor(data.nombre_vendedor)
      if(data.rubro === productoE.lente){
        const coloLente = await this.colorLenteService.verificarColorLente(
          data.atributo1,
        );
        const tipoLente = await this.tipoLenteService.guardarTipoLente(
          data.atributo2,
        ); 
        const material = await this.materialService.guardarMaterial(
          data.atributo3,
        );

        const tipoColorLente = await this.tipoColorLenteService.verificarTipoColorLente(
          data.atributo4,
        );

        const marca = await this.marcaLenteService.guardarMarcaLente(
          data.atributo5,
        );
      
        const tratamiento = await this.tratamientoService.guardarTratamiento(
          data.atributo6,
        );
      
      
       // const rango = await this.rangoService.guardarRangoLente(data.atributo7);
        console.log(data);
        
      if(coloLente && tipoLente&& material && tipoColorLente && marca && tratamiento){
        const recetaCombinacion = await this.combinacionRecetaService.verificarCombinacion(tratamiento._id, material._id, marca._id,coloLente._id, tipoLente._id, tipoColorLente._id)
        VentaGuardar ={

        }
        
      }
      
      }else {
       // console.log(data);
        
      }
     
  }

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
