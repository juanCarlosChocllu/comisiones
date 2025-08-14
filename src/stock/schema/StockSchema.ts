import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'Stock' })
export class Stock extends BaseSchema {
  @Prop()
  cantidad: number;
  @Prop({ type: Types.ObjectId, ref: 'Almacen' })
  almacen: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;
}

export const stockSchema = SchemaFactory.createForClass(Stock);
