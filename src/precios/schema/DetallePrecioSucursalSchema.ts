import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'DetallePrecioSucursal' })
export class DetallePrecioSucursal extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'precio' })
  precio: Types.ObjectId;
}

export const DetallePrecioSucursalSchema = SchemaFactory.createForClass(
  DetallePrecioSucursal,
);
