import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'MetasProductoVip' })
export class MetasProductoVip {
  @Prop({ default: 0 })
  montura: number;

  @Prop({ default: 0 })
  precioMontura: number;

  @Prop({ default: 0 })
  gafa: number;

  @Prop({ default: 0 })
  precioGafa: number;

  @Prop({type:[String]})
  marcaMonturas:string[];

  @Prop({type:[String]})
  marcaGafas:string[];

  @Prop({ default: 0 })
  lenteDeContacto: number;

  @Prop({ ref: 'Sucursal', type: Types.ObjectId })
  sucursal: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}
export const metasProductoVipSchema =
  SchemaFactory.createForClass(MetasProductoVip);
