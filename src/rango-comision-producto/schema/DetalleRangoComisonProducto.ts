import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'DetalleRangoComisonProducto' })
export class DetalleRangoComisonProducto extends BaseSchema {
  @Prop({ type: Number, default: 0 })
  precioMinimo: number;

  @Prop({ type: Number, default: 0 })
  precioMaximo: number;

  @Prop({ type: Number, default: 0 })
  comision: number;

  @Prop()
  nombrePrecio: String;

  @Prop({ type: Types.ObjectId })
  precio: Types.ObjectId;

  @Prop()
  nombre: String;
}
export const DetalleRangoComisonProductoSchema = SchemaFactory.createForClass(
  DetalleRangoComisonProducto,
);
DetalleRangoComisonProductoSchema.index({nombrePrecio:1, precioMinimo:1,precioMaximo:1})
