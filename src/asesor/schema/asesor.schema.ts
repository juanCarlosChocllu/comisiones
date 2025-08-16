import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'Asesor' })
export class Asesor {
  @Prop()
  nombre: string;

  @Prop({ ref: 'Sucursal', type: Types.ObjectId })
  sucursal: Types.ObjectId;

  @Prop({ ref: 'Usuario', type: Types.ObjectId })
  usuario: Types.ObjectId;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({type:Boolean, default:false})
  gestor:boolean

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const asesorSchema = SchemaFactory.createForClass(Asesor);
asesorSchema.index({ sucursal: 1 });
  