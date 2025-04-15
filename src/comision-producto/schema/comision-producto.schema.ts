import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'ComisionProducto' })
export class ComisionProducto {
  @Prop()
  nombre: string;

  @Prop()
  monto: string;

  @Prop({ type: Types.ObjectId, ref: 'PerecioReceta' })
  precioReceta: Types.ObjectId;
}
export const comisionProductoSchema = SchemaFactory.createForClass(ComisionProducto)