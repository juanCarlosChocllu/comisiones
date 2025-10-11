import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionReceta } from './schema/comision-receta.schema';
import { Model, Types } from 'mongoose';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { ActualizarComisionReceta } from './dto/actulizarComisionReceta';
import { flag } from 'src/core/enum/flag';
import { GuardarComisionRecetaI } from 'src/combinacion-receta/interface/combinacionReceta';

@Injectable()
export class ComisionRecetaService {
  constructor(
    @InjectModel(ComisionReceta.name)
    private readonly comisionReceta: Model<ComisionReceta>
  ) {}
  async create(createComisionRecetaDto: CreateComisionRecetaDto) {
    
    
    let contador = 0;
    for (const data of createComisionRecetaDto.data) {
      contador++;

      await this.comisionReceta.create({
        ...data,
        nombre: data.nombre ? data.nombre : `comision ${contador}`,
        combinacionReceta: new Types.ObjectId(
          createComisionRecetaDto.combinacionReceta,
        ),
      });
    }
    return { status: HttpStatus.CREATED };
  }

  async listarComisionReceta(
    precio: string,
    combinacionReceta: Types.ObjectId,
  ) {
    const comisiones = await this.comisionReceta
      .find(
        {
          precio: precio,
          combinacionReceta: new Types.ObjectId(combinacionReceta),
          flag: flag.nuevo,
        },
        { monto: 1, precio: 1 },
      )
      .lean();
    return comisiones;
  }

  async guardarComisionReceta(
    combinacionReceta: Types.ObjectId,
    monto: number,
    comision: number = 0,
    nombre: string,
    precio: string,
  ) {
    const data = await this.comisionReceta.exists({
      combinacionReceta: new Types.ObjectId(combinacionReceta),
      comision: comision,
      monto: monto,
      nombre: nombre,
      precio: precio,
    });
    if (!data) {
      await this.comisionReceta.create({
        combinacionReceta: new Types.ObjectId(combinacionReceta),
        comision: comision,
        monto: monto,
        nombre: nombre,
        precio: precio,
      });
    }
  }

  async actualizarComision(actualizarComisionReceta: ActualizarComisionReceta) {
    const comision = await this.comisionReceta.findOne({
      _id: new Types.ObjectId(actualizarComisionReceta.idComision),
    });
    if (!comision) {
      throw new NotFoundException();
    }
    await this.comisionReceta.updateOne(
      { _id: new Types.ObjectId(actualizarComisionReceta.idComision) },
      { monto: actualizarComisionReceta.monto },
    );
    return { status: HttpStatus.OK };
  }

  async eliminarComision(id: Types.ObjectId) {
    const comision = await this.comisionReceta.findOne({
      _id: new Types.ObjectId(id),
      flag:flag.nuevo
    });
    if (!comision) {
      throw new NotFoundException();
    }

    await this.comisionReceta.deleteOne(
      { _id: new Types.ObjectId(id) }
    );
    return { status: HttpStatus.OK };
  }

  async eliminarComisionRegistrado(
    combinacion: Types.ObjectId,
    precio: string,
  ) {
    return await this.comisionReceta.deleteMany({
      combinacionReceta: new Types.ObjectId(combinacion),
      precio: precio,
    });
  }

  async actulizarComisiones(data: GuardarComisionRecetaI) {
    await this.comisionReceta.deleteMany({
      combinacionReceta: new Types.ObjectId(data.codigoMia),
      precio: data.precio,
    });
    let contador = 0;
    for (const com of data.comisiones) {
      if (com.monto > 0) {
        contador++;
        await this.comisionReceta.create({
          nombre: `comision ${contador}`,
          combinacionReceta: new Types.ObjectId(data.codigoMia),
          monto: com.monto,
          precio: data.precio,
        });
      }
    }
  }
  async registarComisionReceta(
    comision1: number,
    comision2: number,
    tipoPrecio: string,
    combinacion: Types.ObjectId,
  ) {
    await Promise.all([
      this.comisionReceta.create({
        monto: comision1,
        combinacionReceta: new Types.ObjectId(combinacion),
        nombre: 'Comision 1',
        precio: tipoPrecio,
      }),
      this.comisionReceta.create({
        monto: comision2,
        combinacionReceta: new Types.ObjectId(combinacion),
        nombre: 'Comision 2',
        precio: tipoPrecio,
      }),
    ]);

    return;
  }
}
