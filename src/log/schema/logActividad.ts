import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'LogActividad' })
export class LogActividad {
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

  @Prop()
  body: string;

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
export const LogActividadSchema = SchemaFactory.createForClass(LogActividad);
LogActividadSchema.index({fecha:1})

