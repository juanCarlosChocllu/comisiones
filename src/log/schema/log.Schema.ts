import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';

@Schema({ collection: 'Log' })
export class Log  extends BaseSchema {
  @Prop({ Types: Types.ObjectId, ref: 'Usuario' })
  usuario: Types.ObjectId;

  @Prop()
  descripcion: string;

  @Prop()
  method: string;

  @Prop()
  path: string;

  @Prop()
  schema: string;

}
export const logSchema = SchemaFactory.createForClass(Log);
