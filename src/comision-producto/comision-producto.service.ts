import { forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComisionProductoDto } from './dto/create-comision-producto.dto';
import { UpdateComisionProductoDto } from './dto/update-comision-producto.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ComisionProducto } from './schema/comision-producto.schema';
import { Model, Types } from 'mongoose';
import { ProductoService } from 'src/producto/producto.service';
import { ActualizarProductoComisionDto } from './dto/ActualizarComisionProducto.dto';
import { flag } from 'src/core/enum/flag';

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
    
    if (producto && producto.modifiedCount > 0) {
      for (const data of createComisionProductoDto.data) {
        await this.comisionProducto.create({...data, producto:createComisionProductoDto.producto});
      }
      return { status: HttpStatus.CREATED };
    }
    throw new NotFoundException()
  }

 

  async listarComosionPorProducto(producto: Types.ObjectId, precio: string) {

    const comision = await this.comisionProducto.find({
      producto: new Types.ObjectId(producto),
      flag:flag.nuevo,
      precio: precio,
    }, {precio:1, monto:1}).lean();
   
    return comision;
  }
  async listarComosionesPorProducto(producto: Types.ObjectId[], precio: string[]) {

    const comisiones = await this.comisionProducto.find(
    {
      producto: { $in: producto },
      precio: { $in: precio },
      flag: flag.nuevo,
    },
    { producto: 1, precio: 1, monto: 1 }
  ).lean();
   
    return comisiones;
  }
  
 

  async guardarComisionProducto(
    producto: Types.ObjectId,
    monto: number,
    nombre: string,
    precio: string,
  ) {
  
    const comisionProducto = await this.comisionProducto.exists({
      producto: new Types.ObjectId(producto),
      monto: monto,
      nombre: nombre,
      precio: precio,
    }).lean();
    if (!comisionProducto) {
      await this.comisionProducto.create({
        producto: new Types.ObjectId(producto),
        monto: monto,
        nombre: nombre,
        precio: precio,
      });
    }
  }

  async actulizaComision (actualizarProductoComisionDto: ActualizarProductoComisionDto) {
    const comision = await this.comisionProducto.findOne({_id:new Types.ObjectId(actualizarProductoComisionDto.idComision)})
    if(!comision) {
      throw new NotFoundException()
    }
    await this.comisionProducto.updateOne({_id:new Types.ObjectId(actualizarProductoComisionDto.idComision)},{monto:actualizarProductoComisionDto.monto})
    return {status:HttpStatus.OK}

  }
   async eliminarComsionRegistrada(producto:Types.ObjectId, precio:string) {
    await this.comisionProducto.deleteMany({producto:new Types.ObjectId(producto), precio:precio})
    return
   }

  async softDelete(id:Types.ObjectId) {
          const comision = await this.comisionProducto.findOne({_id:new Types.ObjectId(id)})
    if(!comision) {
      throw new NotFoundException()
    }
    await this.comisionProducto.updateOne({_id:new Types.ObjectId(id)},{flag:flag.eliminado})
    return {status:HttpStatus.OK}
  }
  
}
