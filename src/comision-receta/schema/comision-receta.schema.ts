import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';
@Schema({ collection: 'ComisionReceta' })
export class ComisionReceta {
  @Prop()
  precio: string;

  @Prop()
  nombre: string;

  @Prop()
  monto: number;

  @Prop({ type: Types.ObjectId, ref: 'CombinacionReceta' })
  combinacionReceta: Types.ObjectId;

  @Prop()
  diferencia: number;

  @Prop()
  comision: number;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const comisionRecetaSchema =
  SchemaFactory.createForClass(ComisionReceta);
comisionRecetaSchema.index({ combinacionReceta: 1, precio: 1 });
