import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'LogUsuario' })
export class LogUsuario extends BaseSchema {
  @Prop()
  descripcion: string;

  @Prop()
  method: string;

  @Prop()
  path: string;

  @Prop()
  ip: string;

  @Prop()
  schema: string;

  @Prop()
  navegador: string;
}
export const logUsuarioSchema = SchemaFactory.createForClass(LogUsuario);
