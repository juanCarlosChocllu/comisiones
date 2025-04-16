import { Injectable } from '@nestjs/common';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CombinacionReceta } from './schema/combinacion-receta.schema';
import { Model, Types } from 'mongoose';
import { TratamientoService } from 'src/tratamiento/tratamiento.service';
import { MaterialService } from 'src/material/material.service';
import { ColorLenteService } from 'src/color-lente/color-lente.service';
import { MarcaLenteService } from 'src/marca-lente/marca-lente.service';
import { RangoService } from 'src/rango/rango.service';
import { combinacionReceta } from './intercafe/combinacionReceta';
import { TipoLenteService } from 'src/tipo-lente/tipo-lente.service';
import { TipoColorLenteService } from 'src/tipo-color-lente/tipo-color-lente.service';
import { PreciosService } from 'src/precios/precios.service';
import { productoE } from 'src/providers/enum/productos';

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
    private readonly preciosService: PreciosService
  ) {}
  async create(createCombinacionRecetaDto: CreateCombinacionRecetaDto) {
    for (const data of createCombinacionRecetaDto.data) {
      const tratamiento = await this.tratamientoService.guardarTratamiento(
        data.tratamiento,
      );
      const material = await this.materialService.guardarMaterial(
        data.marcaLente,
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
        codigo: codigo,
        colorLente: coloLente._id,
        marcaLente: marca._id,
        material: material._id,
        rango: rango._id,
        tipoLente: tipoLente._id,
        tratamiento: tratamiento._id,
        tipoColorLente: tipoColorLente._id,
      };
     const combinacionLente = await this.combinacionReceta.create(combinacion);
      const precios =  await this.preciosService.guardarPrecioReceta(data.tipoPrecio, data.monto)
      if(precios){
        await this.preciosService.guardarDetallePrecio(productoE.lente, combinacionLente._id, precios._id)
        
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


  async  verificarCombinacion( tratamiento: Types.ObjectId,
    material: Types.ObjectId,
    marca: Types.ObjectId,
    colorLente: Types.ObjectId,
    //rango:  Types.ObjectId,
    tipoLente:  Types.ObjectId,
    tipoColorLente:  Types.ObjectId){
      
    const combinacion = await this.combinacionReceta.findOne({
      material:new Types.ObjectId(material),
      marcaLente:new Types.ObjectId(marca),
      colorLente:new Types.ObjectId(colorLente),
      tipoLente:new Types.ObjectId(tipoLente),
      tipoColorLente:new Types.ObjectId(tipoColorLente),
      //rango:new Types.ObjectId(rango),
      tratamiento:new Types.ObjectId(tratamiento)
    })
    return combinacion
  }

  findAll() {
    return `This action returns all combinacionReceta`;
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
}
