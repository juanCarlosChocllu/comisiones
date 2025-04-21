import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';


@Schema({ collection: 'Sucursal' })
export class Sucursal {
  @Prop()
  nombre: string;

  @Prop({ type: Types.ObjectId, ref: 'Empresa' })
  empresa: Types.ObjectId;

  
  @Prop({ type: Types.ObjectId, ref: 'Zona' })
  zona: Types.ObjectId;
  
  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}

export const sucursaSchema: SchemaFactory =
  SchemaFactory.createForClass(Sucursal);