import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateComisionRecetaDto } from './dto/create-comision-receta.dto';
import { UpdateComisionRecetaDto } from './dto/update-comision-receta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionReceta } from './schema/comision-receta.schema';
import { Model, Types } from 'mongoose';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';

@Injectable()
export class ComisionRecetaService {
  constructor(
    @InjectModel(ComisionReceta.name)
    private readonly comisionReceta: Model<ComisionReceta>,
    @Inject(forwardRef(()=>CombinacionRecetaService )) private readonly combinacionRecetaService: CombinacionRecetaService,
  ) {}
  async create(createComisionRecetaDto: CreateComisionRecetaDto) {
    const comision = await this.combinacionRecetaService.asignarComisionReecta(
      createComisionRecetaDto.combinacionReceta,
    );
    if (comision) {
      for (const data of createComisionRecetaDto.data) {
        await this.comisionReceta.create({
          ...data,
          combinacionReceta: new Types.ObjectId(
            createComisionRecetaDto.combinacionReceta,
          ),
        });
      }
      return { status: HttpStatus.CREATED };
    }
  }

  async listarComisionReceta(
    precio: string,
    combinacionReceta: Types.ObjectId,
  ) {
    const comisiones = await this.comisionReceta.find({
      precio: precio.toUpperCase(),
      combinacionReceta: new Types.ObjectId(combinacionReceta),
    });
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

  findAll() {
    return `This action returns all comisionReceta`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comisionReceta`;
  }

  update(id: number, updateComisionRecetaDto: UpdateComisionRecetaDto) {
    return `This action updates a #${id} comisionReceta`;
  }

  remove(id: number) {
    return `This action removes a #${id} comisionReceta`;
  }
}
