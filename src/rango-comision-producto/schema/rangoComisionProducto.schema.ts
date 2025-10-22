import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'RangoComisionProducto'})
export class RangoComisionProducto extends BaseSchema {
  @Prop()
  nombre: string;

  @Prop({ type: Number, default: 0 })
  precioMinimo: number;

  @Prop({ type: Number, default: 0 })
  precioMaximo: number;
}
export const rangoComisionProductoSchema = SchemaFactory.createForClass(
  RangoComisionProducto,
);
rangoComisionProductoSchema.index({precioMinimo:1,precioMaximo:1, flag:1 })