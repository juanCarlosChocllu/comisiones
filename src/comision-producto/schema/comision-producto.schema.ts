import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ collection: 'ComisionProducto' })
export class ComisionProducto {
  @Prop()
    nombre:string

    @Prop()
    monto:number

    @Prop({type:Types.ObjectId, ref:'Precio'})
    precio:Types.ObjectId

    @Prop()
    diferencia:number

    @Prop()
    comision:number

    @Prop()
    base:boolean
}
export const comisionProductoSchema = SchemaFactory.createForClass(ComisionProducto)