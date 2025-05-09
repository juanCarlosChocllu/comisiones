import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'DetallePrecio' })
export class DetallePrecio {
  @Prop({ ref: 'Producto', type: Types.ObjectId })
  producto: Types.ObjectId;

  @Prop({ ref: 'Servicio', type: Types.ObjectId })
   servicio: Types.ObjectId;

  @Prop({ ref: 'CombinacionReceta', type: Types.ObjectId })
  combinacionReceta: Types.ObjectId;

  @Prop({ ref: 'Precio', type: Types.ObjectId })
  precio: Types.ObjectId;

  @Prop()
  monto: number;

  @Prop()
  tipo: string;

  @Prop({ type: Date, default: Date.now() })
  fecha: Date;

  @Prop({ type: String, enum: flag, default: flag.nuevo })
  flag: flag;
}
export const DetallePrecioSchema = SchemaFactory.createForClass(DetallePrecio);
DetallePrecioSchema.index({ producto: 1 });
DetallePrecioSchema.index({ combinacionReceta: 1 });
