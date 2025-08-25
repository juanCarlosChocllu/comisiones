import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'RendimientoDiario' })
export class RendimientoDiario {
  @Prop({ type: Types.ObjectId, ref: 'Asesor' })
  asesor: Types.ObjectId;

  @Prop()
  atenciones: number;

  @Prop()
  segundoPar: number;
  @Prop()
  fechaDia: string;

  @Prop({
    type: Date,
    default: function () {
      const date = new Date();
      date.setHours(date.getHours() - 4);
      return date;
    },
  })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: string;
}

export const rendimientoDiarioSchema =
  SchemaFactory.createForClass(RendimientoDiario);
rendimientoDiarioSchema.index({fechaDia:1, asesor:1,flag:1})