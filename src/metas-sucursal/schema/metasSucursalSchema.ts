import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'MetasSucursal' })
export class MetasSucursal extends BaseSchema {

  @Prop({type:String})
  codigo:string

  @Prop({ type: Number, default: 0 })
  monto: number;
  @Prop({ type: Number, default: 0 })
  ticket: number;

  @Prop({ type: Number, default: 0 })
  dias: number;

  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop()
  fechaInicio: Date;

  @Prop()
  fechaFin: Date;
}
export const metasSucursalSchema = SchemaFactory.createForClass(MetasSucursal);
