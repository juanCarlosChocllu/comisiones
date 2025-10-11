import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from 'src/core/schema/BaseSchema';
@Schema({ collection: 'RangoComision' })
export class RangoComision extends BaseSchema {
  @Prop({ default: 0 })
  precioMinimo: number;

  @Prop({ default: 0 })
  precioMaximo: number;

  @Prop()
  precio: string;
  @Prop()
  tipo: TipoRangoComisionE;
}
