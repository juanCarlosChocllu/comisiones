import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';


@Schema({ collection: 'Empresa' })
export class Empresa {
  @Prop()
  nombre: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const empresaSchema: SchemaFactory =
  SchemaFactory.createForClass(Empresa);