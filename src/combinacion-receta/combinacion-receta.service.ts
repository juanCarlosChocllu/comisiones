import { Injectable } from '@nestjs/common';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CombinacionReceta } from './schema/combinacion-receta.schema';
import { Model, Types } from 'mongoose';

import { MaterialService } from 'src/material/material.service';
import { ColorLenteService } from 'src/color-lente/color-lente.service';
import { MarcaLenteService } from 'src/marca-lente/marca-lente.service';
import { RangoService } from 'src/rango/rango.service';
import { combinacionReceta, GuardarComisionRecetaI } from './interface/combinacionReceta';
import { TipoLenteService } from 'src/tipo-lente/tipo-lente.service';
import { TipoColorLenteService } from 'src/tipo-color-lente/tipo-color-lente.service';
import { PreciosService } from 'src/precios/service/precios.service';
import { productoE } from 'src/providers/enum/productos';
import { TratamientoService } from 'src/tratamiento/services/tratamiento.service';
import { flag } from 'src/core/enum/flag';
import { tipoProductoPrecio } from 'src/precios/enum/tipoProductoPrecio';
import { log } from 'node:console';
import { PaginadorDto } from 'src/core/dto/paginadorDto';
import { ComisionRecetaService } from 'src/comision-receta/comision-receta.service';

@Injectable()
export class CombinacionRecetaService {
  constructor(
    @InjectModel(CombinacionReceta.name)
    private readonly combinacionReceta: Model<CombinacionReceta>,
    private readonly tratamientoService: TratamientoService,
    private readonly materialService: MaterialService,
    private readonly colorLenteService: ColorLenteService,
    private readonly marcaLenteService: MarcaLenteService,
    private readonly rangoService: RangoService,
    private readonly tipoLenteService: TipoLenteService,
    private readonly tipoColorLenteService: TipoColorLenteService,
    private readonly preciosService: PreciosService,
    private readonly comisionRecetaService: ComisionRecetaService
  ) {}
  async create(createCombinacionRecetaDto: CreateCombinacionRecetaDto) {
 
    
    for (const data of createCombinacionRecetaDto.data) {
      const tratamiento = await this.tratamientoService.guardarTratamiento(
        data.tratamiento,
      );
      const material = await this.materialService.guardarMaterial(
        data.material,
      );
      const marca = await this.marcaLenteService.guardarMarcaLente(
        data.marcaLente,
      );
      const coloLente = await this.colorLenteService.guardarColorLente(
        data.colorLente,
      );
      const rango = await this.rangoService.guardarRangoLente(data.rango);
      const tipoLente = await this.tipoLenteService.guardarTipoLente(
        data.tipoLente,
      );
      const tipoColorLente =
        await this.tipoColorLenteService.guardarTipoColorLente(
          data.tipoColorLente,
        );
      const codigo = this.generarCodigo(
        tratamiento.nombre,
        material.nombre,
        marca.nombre,
        coloLente.nombre,
        rango.nombre,
        tipoLente.nombre,
        tipoColorLente.nombre,
      );
      const combinacion: combinacionReceta = {
       // codigoMia:data.codigoMia,
        codigo: codigo,
        colorLente: coloLente._id,
        marcaLente: marca._id,
        material: material._id,
        rango: rango._id,
        tipoLente: tipoLente._id,
        tratamiento: tratamiento._id,
        tipoColorLente: tipoColorLente._id,
      };
      const combinacionL = await this.combinacionReceta.findOne(combinacion)
      if(combinacionL){
        const precios =  await this.preciosService.guardarPrecioReceta(data.tipoPrecio)
        if(precios){
          await this.preciosService.guardarDetallePrecio(tipoProductoPrecio.lente, combinacionL._id, precios._id)
          
        }
      }else{
           const combinacionLente = await this.combinacionReceta.create(combinacion);
      const precios =  await this.preciosService.guardarPrecioReceta(data.tipoPrecio)
      if(precios){
        await this.preciosService.guardarDetallePrecio(tipoProductoPrecio.lente, combinacionLente._id, precios._id)
        
      }
      }
    

    }
  }
  private generarCodigo(
    tratamiento: string,
    material: string,
    marca: string,
    colorLente: string,
    rango: string,
    tipoLente: string,
    tipoColorLente: string,
  ) {
    const cortar = (texto: string) => texto.slice(0, 3).toUpperCase();
    return [
      cortar(tratamiento),
      cortar(material),
      cortar(marca),
      cortar(colorLente),
      cortar(rango),
      cortar(tipoLente),
      cortar(tipoColorLente),
    ].join('-');
  }


  async  verificarCombinacion( 
    tratamiento: Types.ObjectId,
    material: Types.ObjectId,
    marca: Types.ObjectId,
    colorLente: Types.ObjectId,
    rango:  Types.ObjectId,
    tipoLente:  Types.ObjectId,
    tipoColorLente:  Types.ObjectId){
      

      
    const combinacion = await this.combinacionReceta.exists({
      material:material,
      marcaLente:marca,
      colorLente:colorLente,
      tipoLente:tipoLente,
      tipoColorLente:tipoColorLente,
      rango:new Types.ObjectId(rango),
      tratamiento:new Types.ObjectId(tratamiento)
    })
    return combinacion
  }

  async listar(paginadorDto:PaginadorDto) {

    const combinaciones = await this.combinacionReceta.aggregate([
      {
      $match:{
        flag:flag.nuevo,
      
      },   
      },
      {
        $lookup:{
          from:'Material',
          foreignField:'_id', 
          localField:'material',
          as:'material'
        }
      },
      {
        $unwind:{path:'$material', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'TipoLente',
          foreignField:'_id', 
          localField:'tipoLente',
          as:'tipoLente'
        }
      },
      {
        $unwind:{path:'$tipoLente', preserveNullAndEmptyArrays:false}
      },

      {
        $lookup:{
          from:'Rango',
          foreignField:'_id', 
          localField:'rango',
          as:'rango'
        }
      },
      {
        $unwind:{path:'$rango', preserveNullAndEmptyArrays:false}
      },

      {
        $lookup:{
          from:'ColorLente',
          foreignField:'_id', 
          localField:'colorLente',
          as:'colorLente'
        }
      },
      {
        $unwind:{path:'$colorLente', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'MarcaLente',
          foreignField:'_id', 
          localField:'marcaLente',
          as:'marcaLente'
        }
      },
      {
        $unwind:{path:'$marcaLente', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'Tratamiento',
          foreignField:'_id', 
          localField:'tratamiento',
          as:'tratamiento'
        }
      },
      {
        $unwind:{path:'$tratamiento', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'TipoColorLente',
          foreignField:'_id', 
          localField:'tipoColorLente',
          as:'tipoColorLente'
        }
      },
      {
        $unwind:{path:'$tipoColorLente', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'ComisionReceta',
          foreignField:'combinacionReceta',
          localField:'_id',
          as:'comisionReceta'
        }
      },

      
      {
        $project:{
          codigo:1,
          material:'$material.nombre', 
          tipoLente:'$tipoLente.nombre',
          rango:'$rango.nombre', 
          colorLente:'$colorLente.nombre',
          marcaLente:'$marcaLente.nombre',
          tratamiento:'$tratamiento.nombre',
          tipoColorLente:'$tipoColorLente.nombre',
          comisionReceta:1
          
        }
      },
      {
        $facet:{
          data:[
            {
              $skip: (paginadorDto.pagina -1) * paginadorDto.limite
            },
            {
              $limit:paginadorDto.limite
            }
          ],
          countDocuments:[
            {
              $count:'total'
            }

          ]
        }
      }
  ])
 

 const countDocuments = combinaciones[0].countDocuments[0] ?  combinaciones[0].countDocuments[0].total  :1
 const paginas = Math.ceil((countDocuments / paginadorDto.limite))  
  return {data:combinaciones[0].data, paginas}
  }

  findOne(id: number) {
    return `This action returns a #${id} combinacionReceta`;
  }

  update(id: number, updateCombinacionRecetaDto: UpdateCombinacionRecetaDto) {
    return `This action updates a #${id} combinacionReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} combinacionReceta`;
  }

   async listarCombinacionPorVenta (combinacionReceta:Types.ObjectId){
    const combinaciones = await this.combinacionReceta.aggregate([
      {
      $match:{
        flag:flag.nuevo,
        _id:new  Types.ObjectId(combinacionReceta)
      },   
      },
      {
        $lookup:{
          from:'Material',
          foreignField:'_id', 
          localField:'material',
          as:'material'
        }
      },
      {
        $unwind:{path:'$material', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'TipoLente',
          foreignField:'_id', 
          localField:'tipoLente',
          as:'tipoLente'
        }
      },
      {
        $unwind:{path:'$tipoLente', preserveNullAndEmptyArrays:false}
      },

      {
        $lookup:{
          from:'Rango',
          foreignField:'_id', 
          localField:'rango',
          as:'rango'
        }
      },
      {
        $unwind:{path:'$rango', preserveNullAndEmptyArrays:false}
      },

      {
        $lookup:{
          from:'ColorLente',
          foreignField:'_id', 
          localField:'colorLente',
          as:'colorLente'
        }
      },
      {
        $unwind:{path:'$colorLente', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'MarcaLente',
          foreignField:'_id', 
          localField:'marcaLente',
          as:'marcaLente'
        }
      },
      {
        $unwind:{path:'$marcaLente', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'Tratamiento',
          foreignField:'_id', 
          localField:'tratamiento',
          as:'tratamiento'
        }
      },
      {
        $unwind:{path:'$tratamiento', preserveNullAndEmptyArrays:false}
      },
      {
        $lookup:{
          from:'TipoColorLente',
          foreignField:'_id', 
          localField:'tipoColorLente',
          as:'tipoColorLente'
        }
      },
      {
        $unwind:{path:'$tipoColorLente', preserveNullAndEmptyArrays:false}
      },
      {
        $project:{
          material:'$material.nombre', 
          tipoLente:'$tipoLente.nombre',
          rango:'$rango.nombre', 
          colorLente:'$colorLente.nombre',
          marcaLente:'$marcaLente.nombre',
          tratamiento:'$tratamiento.nombre',
          tipoColorLente:'$tipoColorLente.nombre'
        }
      }
  ])
    return combinaciones[0]
    
   }


   async guardarComisionrecetaCombinacion(data:GuardarComisionRecetaI){
    const tratamiento = await this.tratamientoService.guardarTratamiento(
      data.tratamiento,
    );
    const material = await this.materialService.guardarMaterial(
      data.material,
    );
    const marca = await this.marcaLenteService.guardarMarcaLente(
      data.marcaLente,
    );
    const coloLente = await this.colorLenteService.guardarColorLente(
      data.colorLente,
    );
    const rango = await this.rangoService.guardarRangoLente(data.rango);

    const tipoLente = await this.tipoLenteService.guardarTipoLente(
      data.tipoLente,
    );
    const tipoColorLente =
      await this.tipoColorLenteService.guardarTipoColorLente(
        data.tipoColorLente,
      );
      const combinacion: combinacionReceta = {
        // codigoMia:data.codigoMia,
      
         colorLente: coloLente._id,
         marcaLente: marca._id,
         material: material._id,
         rango: rango._id,
         tipoLente: tipoLente._id,
         tratamiento: tratamiento._id,
         tipoColorLente: tipoColorLente._id,
       };
      const combinacionL = await this.combinacionReceta.findOne(combinacion)
       if(combinacionL){
          const precios = await  this.preciosService.detallePrecioCombinacion(combinacionL._id)
          for (const precio of precios) {
         
            if(precio.nombre === data.precio){
              let contador:number = 0
                for (const com of data.comisiones) {
                    contador ++ 
                    const nombre = `Comision ${contador}`
                   
                    await this.comisionRecetaService.guardarComisionReceta(combinacionL._id,com.monto.result, com.comision,nombre, data.precio)
                    
                    
                }
                
            } 
            
          }
          
       }else {
        console.log(data);
        
       }
       
   }

   
}
