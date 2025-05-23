import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'Servicio' })
export class Servicio {

  @Prop()
  codigoMia:string

  @Prop()
  nombre: string;

  @Prop()
  comision: boolean;

  @Prop()
  descripcion: string;

  @Prop({ type: Date, default: () => Date.now() })
  fecha: Date;

  @Prop({ type: String, default: flag.nuevo })
  flag: string;
}
export const servicioSchema = SchemaFactory.createForClass(Servicio)
servicioSchema.index({codigoMia:1})