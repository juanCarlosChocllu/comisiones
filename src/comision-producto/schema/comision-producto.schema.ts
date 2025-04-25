import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'ComisionProducto' })
export class ComisionProducto {
  @Prop()
  precio:string

  @Prop()
  nombre:string

  @Prop()
  monto:number

  @Prop({type:Types.ObjectId, ref:'Producto'})
  producto:Types.ObjectId

  @Prop()
  diferencia:number

  @Prop()
  comision:number


}
export const comisionProductoSchema = SchemaFactory.createForClass(ComisionProducto)