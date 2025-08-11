import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'ComisionProducto' })
export class ComisionProducto {
  @Prop()
  precio: string;

  @Prop()
  nombre: string;

  @Prop()
  monto: number;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;

  @Prop()
  diferencia: number;

  @Prop()
  comision: number;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}
export const comisionProductoSchema =
  SchemaFactory.createForClass(ComisionProducto);

  //indice para buscar comisiones de cada venta

comisionProductoSchema.index({ producto: 1, precio: 1 , flag:1});
//indice para lo que no tienen comision
comisionProductoSchema.index({ producto: 1, precio: 1});
