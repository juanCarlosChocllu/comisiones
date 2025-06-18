import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'LogDescarga' })
export class LogDescarga {
  @Prop()
  schema: string;
  @Prop()
  fechaDescarga: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}
export const logDescargaSchema = SchemaFactory.createForClass(LogDescarga);
