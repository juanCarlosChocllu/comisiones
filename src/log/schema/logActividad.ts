import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'LogActividad' })
export class LogActividad extends BaseSchema {
  @Prop({ type: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop()
  accion: string;

  @Prop()
  descripcion: string;

  @Prop()
  ip: string;

  @Prop()
  navegador: string;

  @Prop()
  method: string;

  @Prop()
  path: string;

  @Prop()
  schema: string;
}
export const LogActividadSchema = SchemaFactory.createForClass(LogActividad);
