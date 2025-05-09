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

@Injectable()
export class ComisionRecetaService {
  constructor(
    @InjectModel(ComisionReceta.name)
    private readonly comisionReceta: Model<ComisionReceta>,
    @Inject(forwardRef(() => CombinacionRecetaService))
    private readonly combinacionRecetaService: CombinacionRecetaService
  ) {}
  async create(createComisionRecetaDto: CreateComisionRecetaDto) {
    const combinacionReceta = await this.combinacionRecetaService.asignarComisionReceta(
      createComisionRecetaDto.combinacionReceta,
    );
    let contador = 0
    if (combinacionReceta  && combinacionReceta.modifiedCount > 0 ) {
      for (const data of createComisionRecetaDto.data) {
        contador ++ 

        await this.comisionReceta.create({
          ...data,
          nombre:`comision ${contador}`,
          combinacionReceta: new Types.ObjectId(
            createComisionRecetaDto.combinacionReceta,
            
          ),
        });
      }
      return { status: HttpStatus.CREATED };
    }
    throw new NotFoundException()
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
        },
        { monto: 1, precio: 1 },
      )
      .lean();
    return comisiones;
  }

  async guardarComisionReceta(
    combinacionReceta: Types.ObjectId,
    monto: number,
    comision: number,
    nombre: string,
    precio: string,
  ) {
    const diferencia = comision - monto;
    const data = await this.comisionReceta.exists({
      combinacionReceta: new Types.ObjectId(combinacionReceta),
      comision: comision,
      diferencia: diferencia,
      monto: monto,
      nombre: nombre,
      precio: precio,
    });
    if (!data) {
      await this.comisionReceta.create({
        combinacionReceta: new Types.ObjectId(combinacionReceta),
        comision: comision,
        diferencia: diferencia,
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

  async eliminarComision(id:Types.ObjectId) {
    const comision = await this.comisionReceta.findOne({
      _id: new Types.ObjectId(id),
    });
    if (!comision) {
      throw new NotFoundException();
    }
    await this.comisionReceta.updateOne(
      { _id: new Types.ObjectId(id) },
      { flag: flag.eliminado },
    );
    return { status: HttpStatus.OK };
  }
}
