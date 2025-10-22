import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'DetalleRangoComisionProducto' })
export class DetalleRangoComisionProducto extends BaseSchema {
  @Prop({ type: Number, default: 0 })
  comision: number;

  @Prop()
  nombrePrecio: String;

  @Prop({ type: Types.ObjectId })
  precio: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'RangoComisionProducto' })
  rangoComisionProducto: Types.ObjectId;
}
export const DetalleRangoComisionProductoSchema = SchemaFactory.createForClass(
  DetalleRangoComisionProducto,
);
DetalleRangoComisionProductoSchema.index({
  rangoComisionProducto: 1,
});

DetalleRangoComisionProductoSchema.index({
  nombrePrecio: 1,
  flag:1    
});
