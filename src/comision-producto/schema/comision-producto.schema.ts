import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'ComisionProducto' })
export class ComisionProducto {
  @Prop()
  nombre: string;

  @Prop()
  monto: number;

  @Prop()
  tipoComision:string
  
  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;
}
export const comisionProductoSchema = SchemaFactory.createForClass(ComisionProducto)