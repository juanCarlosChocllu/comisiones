import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
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
import { key } from 'src/core/config/config';
import { Precio } from 'src/precios/schema/precio.schema';
@Injectable()
export class CombinacionRecetaService {
  constructor(
    @InjectModel(CombinacionReceta.name)
    private readonly combinacionReceta: Model<CombinacionReceta>,
        @InjectModel(Precio.name)
    private readonly precio: Model<Precio>,
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

  async crearCombinaciones(crearCombinacionDto: CrearCombinacionDto) {
    if(crearCombinacionDto.key != key){
      throw new UnauthorizedException()
    }
    const [
      tratamiento,
      material,
      marca,
      coloLente,
      rango,
      tipoLente,
      tipoColorLente,
    ] = await Promise.all([
      this.tratamientoService.guardarTratamiento(
        crearCombinacionDto.tratamiento,
      ),
      this.materialService.guardarMaterial(crearCombinacionDto.material),
      this.marcaLenteService.guardarMarcaLente(crearCombinacionDto.marcaLente),
      this.colorLenteService.guardarColorLente(crearCombinacionDto.colorLente),
      this.rangoService.guardarRangoLente(crearCombinacionDto.rango),
      this.tipoLenteService.guardarTipoLente(crearCombinacionDto.tipoLente),
      this.tipoColorLenteService.guardarTipoColorLente(
        crearCombinacionDto.tipoColorLente,
      ),
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

    const combinacionL = await this.combinacionReceta.findOne(combinacion).lean();

    if (combinacionL) {
      const precios = await this.preciosService.guardarPrecioReceta(
        crearCombinacionDto.tipoPrecio,
      );
      if (precios) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionL._id,
          precios._id,
          crearCombinacionDto.importe,
        );
      }
      if(crearCombinacionDto.comision1 > 0 && crearCombinacionDto.comision2 > 0 ){
        await this.comisionRecetaService.eliminarComisionRegistrado(combinacionL._id, crearCombinacionDto.tipoPrecio)
        await this.comisionRecetaService.registarComisionReceta(crearCombinacionDto.comision1, crearCombinacionDto.comision2, crearCombinacionDto.tipoPrecio, combinacionL._id)
      }
    } else {
      const combinacionLente = await this.combinacionReceta.create({
        ...combinacion,
        comision: true,
      });
      const precios = await this.preciosService.guardarPrecioReceta(
        crearCombinacionDto.tipoPrecio,
      );
      if (precios) {
        await this.preciosService.guardarDetallePrecio(
          tipoProductoPrecio.lente,
          combinacionLente._id,
          precios._id,
          crearCombinacionDto.importe,
        );
        await this.comisionRecetaService.registarComisionReceta(crearCombinacionDto.comision1, crearCombinacionDto.comision2, crearCombinacionDto.tipoPrecio, combinacionLente._id)
      }
    }
    return { status: HttpStatus.OK };
  }

  async create(createCombinacionRecetaDto: CreateCombinacionRecetaDto) {
    for (const data of createCombinacionRecetaDto.data) {
      if(data.key != key){
        throw new UnauthorizedException()
      }
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
        //codigo: codigo,
        colorLente: coloLente._id,
        marcaLente: marca._id,
        material: material._id,
        rango: rango._id,
        tipoLente: tipoLente._id,
        tratamiento: tratamiento._id,
        tipoColorLente: tipoColorLente._id,
        //monto: 0,
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
            data.monto
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
            data.monto
            
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
    tipoPrecio: string,
  ) {
    /* const combinacion = await this.combinacionReceta.exists({
      material: material,
      marcaLente: marca,
      colorLente: colorLente,
      tipoLente: tipoLente,
      tipoColorLente: tipoColorLente,
      rango: rango,
      tratamiento: tratamiento,
    });*/
    const combinacionEncontarda = await this.combinacionReceta.aggregate([
      {
        $match: {
          material: material,
          marcaLente: marca,
          colorLente: colorLente,
          tipoLente: tipoLente,
          tipoColorLente: tipoColorLente,
          rango: rango,
          tratamiento: tratamiento,
        },
      },
      {
        $lookup: {
          from: 'DetallePrecio',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'detallePrecio',
        },
      },
      {
        $unwind: { path: '$detallePrecio', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'detallePrecio.precio',
          as: 'precio',
        },
      },
      { $unwind: { path: '$precio', preserveNullAndEmptyArrays: false } },
      {
        $match: {
          'precio.nombre': tipoPrecio,
        },
      },
    ]);
    return combinacionEncontarda[0];
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
    const combinacionExiste = await this.combinacionReceta.exists({
      material: material,
      marcaLente: marca,
      colorLente: colorLente,
      tipoLente: tipoLente,
      tipoColorLente: tipoColorLente,
      rango: rango,
      tratamiento: tratamiento,
    });
    if (!combinacionExiste) {
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
    } else {
      const precioEcontrado =
        await this.preciosService.buscarPrecioPorNombre(precio);
      await this.preciosService.guardarDetallePrecio(
        tipoProductoPrecio.lente,
        combinacionExiste._id,
        precioEcontrado._id,
        importe,
      );
      return combinacionExiste;
    }
  }
  async listarCombinaciones(buscadorCombinacionDto: BuscadorCombinacionDto) {
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

  async listarCombinacionesSinComision(
    buscadorCombinacionDto: BuscadorCombinacionDto,
  ) {
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
          from: 'DetallePrecio',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'detallePrecio',
        },
      },
      {
        $unwind: { path: '$detallePrecio', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'detallePrecio.precio',
          as: 'precio',
        },
      },
      {
        $unwind: { path: '$precio', preserveNullAndEmptyArrays: false },
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
          monto: '$detallePrecio.monto',
          tipoPrecio: '$precio.nombre',
        },
      },
    ]);
    const combinaciones =await Promise.all (combinacion.map(async (comb)=>{
       const comision = await this.comisionRecetaService.listarComisionReceta(
        comb.tipoPrecio,
        comb._id,
      );
      return {
        _id: comb._id,
        material: comb.material,
        tipoLente: comb.tipoLente,
        rango: comb.rango,
        colorLente: comb.colorLente,
        marcaLente: comb.marcaLente,
        tratamiento: comb.tratamiento,
        tipoColorLente: comb.tipoColorLente,
        monto: comb.monto,
        tipoPrecio: comb.tipoPrecio,
        comisionReceta: comision,
      };
    }))
  
  
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
      { header: 'comision Fija 1', key: 'comisionFija1', width: 30 },
      { header: 'comision Fija 2', key: 'comisionFija2', width: 30 },
    ];

    for (const comb of combinaciones) {
      let mayor = 0;
      let menor = 0;
      if (comb.comisionReceta.length > 0) {
        const montos = comb.comisionReceta.map((c) => c.monto);
        mayor = Math.max(...montos);
        menor = Math.min(...montos);
      }

      worksheet.addRow({
        id: String(comb._id),
        material: comb.material,
        tipoLente: comb.tipoLente,
        tipoColor: comb.tipoColorLente,
        tratamiento: comb.tratamiento,
        rangos: comb.rango,
        marca: comb.marcaLente,
        color: comb.colorLente,
        tipoPrecio: comb.tipoPrecio,
        monto: comb.monto,
        comisionFija1: mayor,
        comisionFija2: menor,
      });
    }
    /*   worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: false };
      });
    });

    for (let index = 0; index < 9; index++) {
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
    });*/
    return workbook;
  }

  private async combinaciones(
    comision: boolean,
    buscadorCombinacionDto: BuscadorCombinacionDto,
  ) {
    const skip =
      (buscadorCombinacionDto.pagina - 1) * buscadorCombinacionDto.limite;
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
      ...(buscadorCombinacionDto.material
        ? [
            {
              $match: {
                'material.nombre': new RegExp(
                  buscadorCombinacionDto.material,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tipoLente
        ? [
            {
              $match: {
                'tipoLente.nombre': new RegExp(
                  buscadorCombinacionDto.tipoLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.rango
        ? [
            {
              $match: {
                'rango.nombre': new RegExp(buscadorCombinacionDto.rango, 'i'),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.colorLente
        ? [
            {
              $match: {
                'colorLente.nombre': new RegExp(
                  buscadorCombinacionDto.colorLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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

      ...(buscadorCombinacionDto.marcaLente
        ? [
            {
              $match: {
                'marcaLente.nombre': new RegExp(
                  buscadorCombinacionDto.marcaLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tratamiento
        ? [
            {
              $match: {
                'tratamiento.nombre': new RegExp(
                  buscadorCombinacionDto.tratamiento,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tipoColorLente
        ? [
            {
              $match: {
                'tipoColorLente.nombre': new RegExp(
                  buscadorCombinacionDto.tipoColorLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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
     // ...(comision == false ? { comision: comision } : {}),
    });
  
    const total = calcularPaginas(
      countDocuments,
      buscadorCombinacionDto.limite,
    );
    const combinaciones = await this.combinacionReceta.aggregate(pipeline, {
      allowDiskUse: true,
    });
    console.log(total);
    
    return { data: combinaciones, total };
  }

  private async combinacionesSinComision(
    buscadorCombinacionDto: BuscadorCombinacionDto,
  ) {
    const skip =
      (buscadorCombinacionDto.pagina - 1) * buscadorCombinacionDto.limite;

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
      ...(buscadorCombinacionDto.material
        ? [
            {
              $match: {
                'material.nombre': new RegExp(
                  buscadorCombinacionDto.material,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tipoLente
        ? [
            {
              $match: {
                'tipoLente.nombre': new RegExp(
                  buscadorCombinacionDto.tipoLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.rango
        ? [
            {
              $match: {
                'rango.nombre': new RegExp(buscadorCombinacionDto.rango, 'i'),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.colorLente
        ? [
            {
              $match: {
                'colorLente.nombre': new RegExp(
                  buscadorCombinacionDto.colorLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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

      ...(buscadorCombinacionDto.marcaLente
        ? [
            {
              $match: {
                'marcaLente.nombre': new RegExp(
                  buscadorCombinacionDto.marcaLente,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tratamiento
        ? [
            {
              $match: {
                'tratamiento.nombre': new RegExp(
                  buscadorCombinacionDto.tratamiento,
                  'i',
                ),
              },
            },
          ]
        : []),
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
      ...(buscadorCombinacionDto.tipoColorLente
        ? [
            {
              $match: {
                'tipoColorLente.nombre': new RegExp(
                  buscadorCombinacionDto.tipoColorLente,
                  'i',
                ),
              },
            },
          ]
        : []),

      {
        $lookup: {
          from: 'ComisionReceta',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'comisionReceta',
        },
      },
      {
        $match: {
          comisionReceta: { $eq: [] },
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
    });

    const total = calcularPaginas(
      countDocuments,
      buscadorCombinacionDto.limite,
    );
    const combinaciones = await this.combinacionReceta.aggregate(pipeline);
    
    
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
    const combinacionL = await this.combinacionReceta.findOne(combinacion).lean()
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
      await this.comisionRecetaService.eliminarComisionRegistrado(combinacionL._id, precio.nombre)
      let contador: number = 0;

      for (const com of data.comisiones) {
        console.log('monto' , com.monto);
        
        if (com.monto > 0) {
          contador++;
          const nombre = `Comision ${contador}`;

          await this.comisionRecetaService.guardarComisionReceta(
            combinacionL._id,
            com.monto,
            com.comision,
            nombre,
            data.precio,
          );
        }
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
        if (com.monto > 0) {
          contador++;
          const nombre = `Comision ${contador}`;
          await this.comisionRecetaService.guardarComisionReceta(
            combinacionL._id,
            com.monto,
            com.comision,
            nombre,
            data.precio,
          );
        }
      }
    }
  }

  async descargarCombinacionesSinComision() {
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
          from: 'DetallePrecio',
          foreignField: 'combinacionReceta',
          localField: '_id',
          as: 'detallePrecio',
        },
      },
      {
        $unwind: { path: '$detallePrecio', preserveNullAndEmptyArrays: false },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'detallePrecio.precio',
          as: 'precio',
        },
      },
      {
        $unwind: { path: '$precio', preserveNullAndEmptyArrays: false },
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
          monto: '$detallePrecio.monto',
          tipoPrecio: '$precio.nombre',
        },
      },
    ]);
    const combinaciones = [];
    for (const comb of combinacion) {
      const comision = await this.comisionRecetaService.listarComisionReceta(
        comb.tipoPrecio,
        comb._id,
      );
      
      if(comision.length <= 0){
        console.log(comision);
        
        const data = {
        _id: comb._id,
        material: comb.material,
        tipoLente: comb.tipoLente,
        rango: comb.rango,
        colorLente: comb.colorLente,
        marcaLente: comb.marcaLente,
        tratamiento: comb.tratamiento,
        tipoColorLente: comb.tipoColorLente,
        monto: comb.monto,
        tipoPrecio: comb.tipoPrecio,
        comisionReceta: comision,
      };
      combinaciones.push(data);
      }
    }

    console.log(combinaciones);

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
      { header: 'comision Fija 1', key: 'comisionFija1', width: 30 },
      { header: 'comision Fija 2', key: 'comisionFija2', width: 30 },
    ];

    for (const comb of combinaciones) {
    

      worksheet.addRow({
        id: String(comb._id),
        material: comb.material,
        tipoLente: comb.tipoLente,
        tipoColor: comb.tipoColorLente,
        tratamiento: comb.tratamiento,
        rangos: comb.rango,
        marca: comb.marcaLente,
        color: comb.colorLente,
        tipoPrecio: comb.tipoPrecio,
        monto: comb.monto,
        comisionFija1: 0,
        comisionFija2: 0,
      });
    }
    /*   worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.protection = { locked: false };
      });
    });

    for (let index = 0; index < 9; index++) {
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
    });*/
    return workbook;
  }
}
