import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'Precio' })
export class Precio {
  @Prop()
  nombre: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const PrecioSchema = SchemaFactory.createForClass(Precio);
PrecioSchema.index({nombre:1})