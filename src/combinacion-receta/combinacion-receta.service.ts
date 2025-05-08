import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCombinacionRecetaDto } from './dto/create-combinacion-receta.dto';
import { UpdateCombinacionRecetaDto } from './dto/update-combinacion-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CombinacionReceta } from './schema/combinacion-receta.schema';
import { Model, PipelineStage, Types } from 'mongoose';

import { MaterialService } from 'src/material/material.service';
import { ColorLenteService } from 'src/color-lente/color-lente.service';
import { MarcaLenteService } from 'src/marca-lente/marca-lente.service';
import { RangoService } from 'src/rango/rango.service';
import {
  combinacionReceta,
  GuardarComisionRecetaI,
} from './interface/combinacionReceta';
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
import * as ExcelJS from 'exceljs';
import { calcularPaginas } from 'src/core/utils/paginador';
import { BuscadorCombinacionDto } from './dto/buscadorCombinacionReceta.dto';
import { BuscadorCombinacioRecetaI } from './interface/buscadorCombinacion';
import { CrearCombinacionDto } from './dto/CrearCombinacion.dto';
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
    private readonly comisionRecetaService: ComisionRecetaService,
  ) {}

   async crearCombinaciones(crearCombinacionDto : CrearCombinacionDto){
    console.log(crearCombinacionDto);
    
    const [
      tratamiento,
      material,
      marca,
      coloLente,
      rango,
      tipoLente,
      tipoColorLente,
    ] = await Promise.all([
      this.tratamientoService.guardarTratamiento(crearCombinacionDto.tratamiento),
      this.materialService.guardarMaterial(crearCombinacionDto.material),
      this.marcaLenteService.guardarMarcaLente(crearCombinacionDto.marcaLente),
      this.colorLenteService.guardarColorLente(crearCombinacionDto.colorLente),
      this.rangoService.guardarRangoLente(crearCombinacionDto.rango),
      this.tipoLenteService.guardarTipoLente(crearCombinacionDto.tipoLente),
      this.tipoColorLenteService.guardarTipoColorLente(crearCombinacionDto.tipoColorLente),
    ]);

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
      colorLente: coloLente._id,
      marcaLente: marca._id,
      material: material._id,
      rango: rango._id,
      tipoLente: tipoLente._id,
      tratamiento: tratamiento._id,
      tipoColorLente: tipoColorLente._id,

    };

    const combinacionL = await this.combinacionReceta.findOne(combinacion);
   
    if (combinacionL) {
      const precios = await this.preciosService.guardarPrecioReceta(
        crearCombinacionDto.tipoPrecio,
      );
      if (precios) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionL._id,
          precios._id,
          crearCombinacionDto.importe
        );
      }
    } else {
      const combinacionLente =
        await this.combinacionReceta.create({...combinacion, comision:false});
      const precios = await this.preciosService.guardarPrecioReceta(
        crearCombinacionDto.tipoPrecio,
      );
      if (precios) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionLente._id,
          precios._id,
          crearCombinacionDto.importe
        );
      }
    }
    return {status:HttpStatus.OK}
   }

  async create(createCombinacionRecetaDto: CreateCombinacionRecetaDto) {
    for (const data of createCombinacionRecetaDto.data) {
      const [
        tratamiento,
        material,
        marca,
        coloLente,
        rango,
        tipoLente,
        tipoColorLente,
      ] = await Promise.all([
        this.tratamientoService.guardarTratamiento(data.tratamiento),
        this.materialService.guardarMaterial(data.material),
        this.marcaLenteService.guardarMarcaLente(data.marcaLente),
        this.colorLenteService.guardarColorLente(data.colorLente),
        this.rangoService.guardarRangoLente(data.rango),
        this.tipoLenteService.guardarTipoLente(data.tipoLente),
        this.tipoColorLenteService.guardarTipoColorLente(data.tipoColorLente),
      ]);

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
        monto: 0,
      };
      const combinacionL = await this.combinacionReceta.findOne(combinacion);
      if (combinacionL) {
        const precios = await this.preciosService.guardarPrecioReceta(
          data.tipoPrecio,
        );
        if (precios) {
          await this.preciosService.guardarDetallePrecio(
            tipoProductoPrecio.lente,
            combinacionL._id,
            precios._id,
          );
        }
      } else {
        const combinacionLente =
          await this.combinacionReceta.create(combinacion);
        const precios = await this.preciosService.guardarPrecioReceta(
          data.tipoPrecio,
        );
        if (precios) {
          await this.preciosService.guardarDetallePrecio(
            tipoProductoPrecio.lente,
            combinacionLente._id,
            precios._id,
          );
        }
      }
    }
  }
  generarCodigo(
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

  async verificarCombinacion(
    tratamiento: Types.ObjectId,
    material: Types.ObjectId,
    marca: Types.ObjectId,
    colorLente: Types.ObjectId,
    rango: Types.ObjectId,
    tipoLente: Types.ObjectId,
    tipoColorLente: Types.ObjectId,
  ) {
    const combinacion = await this.combinacionReceta.exists({
      material: material,
      marcaLente: marca,
      colorLente: colorLente,
      tipoLente: tipoLente,
      tipoColorLente: tipoColorLente,
      rango: rango,
      tratamiento: tratamiento,
    });
    return combinacion;
  }

  async crearCombinacion(
    tratamiento: Types.ObjectId,
    material: Types.ObjectId,
    marca: Types.ObjectId,
    colorLente: Types.ObjectId,
    rango: Types.ObjectId,
    tipoLente: Types.ObjectId,
    tipoColorLente: Types.ObjectId,
    codigo: string,
    precio: string,
    importe: number,
  ) {
    const combinacion = await this.combinacionReceta.create({
      material: material,
      marcaLente: marca,
      colorLente: colorLente,
      tipoLente: tipoLente,
      tipoColorLente: tipoColorLente,
      rango: rango,
      tratamiento: tratamiento,
      codigo: codigo,
      comision: false,
    });
    const precioEcontrado =
      await this.preciosService.buscarPrecioPorNombre(precio);
    await this.preciosService.guardarDetallePrecio(
      tipoProductoPrecio.lente,
      combinacion._id,
      precioEcontrado._id,
      importe,
    );
    return combinacion;
  }
  async listarCombinaciones( buscadorCombinacionDto:BuscadorCombinacionDto) {
    const data = await this.combinaciones(true, buscadorCombinacionDto);
    return { data: data.data, paginas: data.total };
  }

  async asignarComisionReceta(id: Types.ObjectId) {
    const data = await this.combinacionReceta.findOne({
      _id: new Types.ObjectId(id),
      comision: false,
    });
    if (data) {
      return await this.combinacionReceta.updateOne(
        { _id: new Types.ObjectId(id) },
        { comision: true },
      );
    }
  }


  async listarCombinacionesSinComision(buscadorCombinacionDto:BuscadorCombinacionDto) {
    const data = await this.combinacionesSinComision(buscadorCombinacionDto);
    return { data: data.data, paginas: data.total };
  }
  async descargarCombinaciones() {
    const combinacion = await this.combinacionReceta.aggregate([
      {
        $match: {
          flag: flag.nuevo,
        },
      },
      {
        $lookup: {
          from: 'Material',
          foreignField: '_id',
          localField: 'material',
          as: 'material',
        },
      },
      {
        $unwind: { path: '$material', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
          as: 'tipoLente',
        },
      },
      {
        $unwind: { path: '$tipoLente', preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: 'Rango',
          foreignField: '_id',
          localField: 'rango',
          as: 'rango',
        },
      },
      {
        $unwind: { path: '$rango', preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorLente',
        },
      },
      {
        $unwind: { path: '$colorLente', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcaLente',
        },
      },
      {
        $unwind: { path: '$marcaLente', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Tratamiento',
          foreignField: '_id',
          localField: 'tratamiento',
          as: 'tratamiento',
        },
      },
      {
        $unwind: { path: '$tratamiento', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipoColorLente',
        },
      },
      {
        $unwind: { path: '$tipoColorLente', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'ComisionReceta',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'comisionReceta',
        },
      },

      {
        $project: {
          codigo: 1,
          monto: 1,
          material: '$material.nombre',
          tipoLente: '$tipoLente.nombre',
          rango: '$rango.nombre',
          colorLente: '$colorLente.nombre',
          marcaLente: '$marcaLente.nombre',
          tratamiento: '$tratamiento.nombre',
          tipoColorLente: '$tipoColorLente.nombre',
          comisionReceta: 1,
        },
      },
    ]);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('hoja 1');
    worksheet.columns = [
      { header: 'id', key: 'id', width: 30 },
      { header: 'material', key: 'material', width: 30 },
      { header: 'tipoLente', key: 'tipoLente', width: 30 },
      { header: 'tipoColor', key: 'tipoColor', width: 30 },
      { header: 'tratamiento', key: 'tratamiento', width: 30 },
      { header: 'rangos', key: 'rangos', width: 60 },
      { header: 'marca', key: 'marca', width: 30 },
      { header: 'color', key: 'color', width: 30 },
      { header: 'tipoPrecio', key: 'tipoPrecio', width: 30 },
      { header: 'monto', key: 'monto', width: 15 },
      { header: 'comision_3%', key: 'comision1', width: 30 },
      { header: 'comisionFija', key: 'comisionFija1', width: 30 },
      { header: 'comision', key: 'comision_2', width: 30 },
      { header: 'comisionFija', key: 'comisionFija2', width: 30 },
    ];

    for (const comb of combinacion) {
      console.log(comb.comisionReceta);
      //  console.log(comb.comisionReceta.length > 0 ? comb.comisionReceta.reduce((max, actual) =>  actual.comision > max.comision ? actual.comision : max.comision ) :0);

      /* worksheet.addRow({
        id:comb._id,
        material:comb.material,
        tipoLente:comb.tipoLente,
        tipoColor:comb.tipoColorLente,
        tratamiento:comb.tratamiento,
        rangos:comb.rango,
        marca:comb.marcaLente,
        color:comb.colorLente,
        tipoPrecio:comb.comisionReceta.length > 0 ? comb.comisionReceta[0].precio :'',
        monto:comb.monto,
        comision1:comb.comisionReceta.length > 0 ? comb.comisionReceta.reduce((max, actual) =>  actual.comision > max.comision ? actual.comision : max.comision ) :0,
        comisionFija1:comb.comisionReceta.length > 0 ? comb.comisionReceta.reduce((max, actual) =>  actual.monto > max.monto ? actual.monto : max.monto) :0,
        comision_2:comb.comisionReceta.length > 0 ? comb.comisionReceta.reduce((max, actual) =>  actual.comision<  max.comision ? actual.comision : max.comision ) :0,
        comisionFija2:comb.comisionReceta.length > 0 ? comb.comisionReceta.reduce((max, actual) =>  actual.monto < max.monto ? actual.monto : max.monto) :0,  
      })*/
    }
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: false };
      });
    });

    for (let index = 0; index < 8; index++) {
      worksheet.getColumn(index + 1).eachCell((cell, rowNumber) => {
        if (rowNumber > 1) {
          cell.protection = { locked: true };
        }
      });
    }

    await worksheet.protect('gay el que lo adivina', {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });

    worksheet.getColumn(10).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.protection = { locked: false };
      }
    });

    worksheet.getColumn(11).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.protection = { locked: false };
      }
    });

    worksheet.getColumn(12).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.protection = { locked: false };
      }
    });

    worksheet.getColumn(13).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.protection = { locked: false };
      }
    });

    worksheet.getColumn(14).eachCell((cell, rowNumber) => {
      if (rowNumber > 1) {
        cell.protection = { locked: false };
      }
    });

    return workbook;
  }
  private async combinaciones(comision: boolean, buscadorCombinacionDto:BuscadorCombinacionDto) {
  
      
    const skip = (buscadorCombinacionDto.pagina - 1) * buscadorCombinacionDto.limite;

  
  
    const pipeline: PipelineStage[] = [
      {
        $lookup: {
          from: 'Material',
          foreignField: '_id',
          localField: 'material',
          as: 'material',
        },
      },
      {
        $unwind: { path: '$material', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.material) ? [{$match:{'material.nombre': new RegExp(buscadorCombinacionDto.material,'i') }}  ]:[],
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
          as: 'tipoLente',
        },
      },
      {
        $unwind: { path: '$tipoLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tipoLente) ? [{$match:{'tipoLente.nombre': new RegExp(buscadorCombinacionDto.tipoLente,'i') }}  ]:[],
      {
        $lookup: {
          from: 'Rango',
          foreignField: '_id',
          localField: 'rango',
          as: 'rango',
        },
      },
      {
        $unwind: { path: '$rango', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.rango) ? [{$match:{'rango.nombre': new RegExp(buscadorCombinacionDto.rango,'i') }}  ]:[],
      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorLente',
        },
      },
      {
        $unwind: { path: '$colorLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.colorLente) ? [{$match:{'colorLente.nombre': new RegExp(buscadorCombinacionDto.colorLente,'i') }}]:[],
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcaLente',
        },
      },
      {
        $unwind: { path: '$marcaLente', preserveNullAndEmptyArrays: false },
      },

      ...(buscadorCombinacionDto.marcaLente) ? [{$match:{'marcaLente.nombre': new RegExp(buscadorCombinacionDto.marcaLente,'i') }}]:[],
      {
        $lookup: {
          from: 'Tratamiento',
          foreignField: '_id',
          localField: 'tratamiento',
          as: 'tratamiento',
        },
      },
      {
        $unwind: { path: '$tratamiento', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tratamiento) ? [{$match:{'tratamiento.nombre': new RegExp(buscadorCombinacionDto.tratamiento,'i') }}]:[],
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipoColorLente',
        },
      },
      {
        $unwind: { path: '$tipoColorLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tipoColorLente) ? [{$match:{'tipoColorLente.nombre': new RegExp(buscadorCombinacionDto.tipoColorLente,'i') }}]:[],
      {
        $lookup: {
          from: 'ComisionReceta',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'comisionReceta',
        },
      },
      
      {
        $project: {
          codigo: 1,
          material: '$material.nombre',
          tipoLente: '$tipoLente.nombre',
          rango: '$rango.nombre',
          colorLente: '$colorLente.nombre',
          marcaLente: '$marcaLente.nombre',
          tratamiento: '$tratamiento.nombre',
          tipoColorLente: '$tipoColorLente.nombre',
          comisionReceta: 1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: buscadorCombinacionDto.limite,
      },
    ];

    const countDocuments = await this.combinacionReceta.countDocuments({
      flag: flag.nuevo,
      ...(comision == false ? { comision: comision } : {}),
    });
    const total = calcularPaginas(countDocuments, buscadorCombinacionDto.limite);
    const combinaciones = await this.combinacionReceta.aggregate(pipeline, {
      allowDiskUse: true,
    });
    return { data: combinaciones, total };
  }

  private async combinacionesSinComision( buscadorCombinacionDto:BuscadorCombinacionDto) {      
    const skip = (buscadorCombinacionDto.pagina - 1) * buscadorCombinacionDto.limite;
    const pipeline: PipelineStage[] = [
      {
        $match:{comision:false}
      },
      {
        $lookup: {
          from: 'Material',
          foreignField: '_id',
          localField: 'material',
          as: 'material',
        },
      },
      {
        $unwind: { path: '$material', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.material) ? [{$match:{'material.nombre': new RegExp(buscadorCombinacionDto.material,'i') }}  ]:[],
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
          as: 'tipoLente',
        },
      },
      {
        $unwind: { path: '$tipoLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tipoLente) ? [{$match:{'tipoLente.nombre': new RegExp(buscadorCombinacionDto.tipoLente,'i') }}  ]:[],
      {
        $lookup: {
          from: 'Rango',
          foreignField: '_id',
          localField: 'rango',
          as: 'rango',
        },
      },
      {
        $unwind: { path: '$rango', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.rango) ? [{$match:{'rango.nombre': new RegExp(buscadorCombinacionDto.rango,'i') }}  ]:[],
      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorLente',
        },
      },
      {
        $unwind: { path: '$colorLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.colorLente) ? [{$match:{'colorLente.nombre': new RegExp(buscadorCombinacionDto.colorLente,'i') }}]:[],
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcaLente',
        },
      },
      {
        $unwind: { path: '$marcaLente', preserveNullAndEmptyArrays: false },
      },

      ...(buscadorCombinacionDto.marcaLente) ? [{$match:{'marcaLente.nombre': new RegExp(buscadorCombinacionDto.marcaLente,'i') }}]:[],
      {
        $lookup: {
          from: 'Tratamiento',
          foreignField: '_id',
          localField: 'tratamiento',
          as: 'tratamiento',
        },
      },
      {
        $unwind: { path: '$tratamiento', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tratamiento) ? [{$match:{'tratamiento.nombre': new RegExp(buscadorCombinacionDto.tratamiento,'i') }}]:[],
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipoColorLente',
        },
      },
      {
        $unwind: { path: '$tipoColorLente', preserveNullAndEmptyArrays: false },
      },
      ...(buscadorCombinacionDto.tipoColorLente) ? [{$match:{'tipoColorLente.nombre': new RegExp(buscadorCombinacionDto.tipoColorLente,'i') }}]:[],
     /* {
        $lookup: {
          from: 'DetallePrecio',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'detallePrecio',
        },
      },
      {$unwind:{path:'$detallePrecio', preserveNullAndEmptyArrays:false} },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'detallePrecio.precio',
          as: 'precio',
        },
      },
      {$unwind:{path:'$precio', preserveNullAndEmptyArrays:false} },*/
      {
        $project: {
          codigo: 1,
          material: '$material.nombre',
          tipoLente: '$tipoLente.nombre',
          rango: '$rango.nombre',
          colorLente: '$colorLente.nombre',
          marcaLente: '$marcaLente.nombre',
          tratamiento: '$tratamiento.nombre',
          tipoColorLente: '$tipoColorLente.nombre',
          //precio: '$precio.nombre',
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: buscadorCombinacionDto.limite,
      },
    ];

    const countDocuments = await this.combinacionReceta.countDocuments({
      flag: flag.nuevo, comision:false});
    const total = calcularPaginas(countDocuments, buscadorCombinacionDto.limite);
    const combinaciones = await this.combinacionReceta.aggregate(pipeline, {
      allowDiskUse: true,
    });
    return { data: combinaciones, total };
  }

  async listarCombinacionPorVenta(combinacionReceta: Types.ObjectId) {
    const combinaciones = await this.combinacionReceta.aggregate([
      {
        $match: {
          flag: flag.nuevo,
          _id: new Types.ObjectId(combinacionReceta),
        },
      },
      {
        $lookup: {
          from: 'Material',
          foreignField: '_id',
          localField: 'material',
          as: 'material',
        },
      },
      {
        $unwind: { path: '$material', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'TipoLente',
          foreignField: '_id',
          localField: 'tipoLente',
          as: 'tipoLente',
        },
      },
      {
        $unwind: { path: '$tipoLente', preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: 'Rango',
          foreignField: '_id',
          localField: 'rango',
          as: 'rango',
        },
      },
      {
        $unwind: { path: '$rango', preserveNullAndEmptyArrays: false },
      },

      {
        $lookup: {
          from: 'ColorLente',
          foreignField: '_id',
          localField: 'colorLente',
          as: 'colorLente',
        },
      },
      {
        $unwind: { path: '$colorLente', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'MarcaLente',
          foreignField: '_id',
          localField: 'marcaLente',
          as: 'marcaLente',
        },
      },
      {
        $unwind: { path: '$marcaLente', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Tratamiento',
          foreignField: '_id',
          localField: 'tratamiento',
          as: 'tratamiento',
        },
      },
      {
        $unwind: { path: '$tratamiento', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'TipoColorLente',
          foreignField: '_id',
          localField: 'tipoColorLente',
          as: 'tipoColorLente',
        },
      },
      {
        $unwind: { path: '$tipoColorLente', preserveNullAndEmptyArrays: false },
      },
      
      {
        $project: {
          material: '$material.nombre',
          tipoLente: '$tipoLente.nombre',
          rango: '$rango.nombre',
          colorLente: '$colorLente.nombre',
          marcaLente: '$marcaLente.nombre',
          tratamiento: '$tratamiento.nombre',
          tipoColorLente: '$tipoColorLente.nombre',
        },
      },
    ]);
    return combinaciones[0];
  }

  async guardarComisionrecetaCombinacion(data: GuardarComisionRecetaI) {
    const [
      tratamiento,
      material,
      marca,
      coloLente,
      rango,
      tipoLente,
      tipoColorLente,
    ] = await Promise.all([
      this.tratamientoService.guardarTratamiento(data.tratamiento),
      this.materialService.guardarMaterial(data.material),
      this.marcaLenteService.guardarMarcaLente(data.marcaLente),
      this.colorLenteService.guardarColorLente(data.colorLente),
      this.rangoService.guardarRangoLente(data.rango),
      this.tipoLenteService.guardarTipoLente(data.tipoLente),
      this.tipoColorLenteService.guardarTipoColorLente(data.tipoColorLente),
    ]);

    const combinacion: combinacionReceta = {
      //codigoMia:data.codigoMia,
      colorLente: coloLente._id,
      marcaLente: marca._id,
      material: material._id,
      rango: rango._id,
      tipoLente: tipoLente._id,
      tratamiento: tratamiento._id,
      tipoColorLente: tipoColorLente._id,
    };
    const combinacionL = await this.combinacionReceta.findOne(combinacion);
    if (combinacionL) {
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);

      if (precio) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionL._id,
          precio._id,
          data.monto,
        );
      }
      let contador: number = 0;
      for (const com of data.comisiones) {
        contador++;
        const nombre = `Comision ${contador}`;

        await this.comisionRecetaService.guardarComisionReceta(
          combinacionL._id,
          com.monto.result,
          com.comision.result,
          nombre,
          data.precio,
        );
      }
    } else {
      const combinacionL = await this.combinacionReceta.create({
        ...combinacion,
        comision: true,
      });
      const precio = await this.preciosService.guardarPrecioReceta(data.precio);

      if (precio) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionL._id,
          precio._id,
          data.monto,
        );
      }
      let contador = 0;
      for (const com of data.comisiones) {
        contador++;
        const nombre = `Comision ${contador}`;
        await this.comisionRecetaService.guardarComisionReceta(
          combinacionL._id,
          com.monto.result,
          com.comision.result,
          nombre,
          data.precio,
        );
      }
    }
  }
}
