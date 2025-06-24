import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'Log' })
export class Log {
    @Prop({ Types: Types.ObjectId, ref: 'Usuario' })
    usuario: Types.ObjectId;


    @Prop()
    descripcion: string;

    @Prop()
    method: string;

    @Prop()
    path: string

    @Prop()
    schema:string

    @Prop({ Types: Date, default: () => Date.now() })
    fecha: Date;
}
export const logSchema= SchemaFactory.createForClass(Log)