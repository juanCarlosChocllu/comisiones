import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { UpdateComisionProductoDto } from './dto/update-comision-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionProducto } from './schema/comision-producto.schema';
import { Model, Types } from 'mongoose';
import { ProductoService } from 'src/producto/producto.service';

@Injectable()
export class ComisionProductoService {
  constructor(
    @InjectModel(ComisionProducto.name)
    private readonly comisionProducto: Model<ComisionProducto>,
    @Inject(forwardRef(() => ProductoService))
    private readonly productoService: ProductoService,
  ) {}
  async create(createComisionProductoDto: CreateComisionProductoDto) {
    createComisionProductoDto.producto = new Types.ObjectId(
      createComisionProductoDto.producto,
    );
    const producto = await this.productoService.asignaComisionProducto(
      createComisionProductoDto.producto,
    );

    console.log(createComisionProductoDto);

    if (producto && producto.modifiedCount > 0) {
      for (const data of createComisionProductoDto.data) {
        console.log(data);

        await this.comisionProducto.create(data);
      }
      return { status: HttpStatus.CREATED };
    }
    throw new NotFoundException()
  }

  findAll() {
    return `This action returns all comisionProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comisionProducto`;
  }

  update(id: number, updateComisionProductoDto: UpdateComisionProductoDto) {
    return `This action updates a #${id} comisionProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} comisionProducto`;
  }

  async listarComosionPorProducto(producto: Types.ObjectId, precio: string) {
    const comision = await this.comisionProducto.find({
      producto: new Types.ObjectId(producto),
      precio: precio.toUpperCase(),
    });
    return comision;
  }

  async guardarComisionProducto(
    producto: Types.ObjectId,
    monto: number,
    comision: number,
    nombre: string,
    precio: string,
  ) {
    comision = comision ? comision : 0;
    monto = monto ? monto : 0;
    const diferencia = comision - monto;
    const comisionProducto = await this.comisionProducto.findOne({
      producto: new Types.ObjectId(producto),
      comision: comision,
      diferencia: diferencia,
      monto: monto,
      nombre: nombre,
      precio: precio,
    });
    if (!comisionProducto) {
      await this.comisionProducto.create({
        producto: new Types.ObjectId(producto),
        comision: comision,
        diferencia: diferencia,
        monto: monto,
        nombre: nombre,
        precio: precio,
      });
    }
  }
}
