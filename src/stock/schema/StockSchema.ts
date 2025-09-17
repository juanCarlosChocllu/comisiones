import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'Stock' })
export class Stock extends BaseSchema {
  @Prop()
  cantidad: number;

  @Prop({ type: Types.ObjectId, ref: 'Almacen' })
  almacen: Types.ObjectId;


  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;

  @Prop()
  tipo:string

   @Prop()
  codigoMia:string
}

export const stockSchema = SchemaFactory.createForClass(Stock);
stockSchema.index({producto:1})