import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/core/enum/flag";
@Schema({collection:'ComisionServicio'})
export class ComisionServicio {
      @Prop()
      precio: string;
    
      @Prop()
      nombre: string;
    
      @Prop()
      monto: number;
    
      @Prop({ type: Types.ObjectId, ref: 'Servicio' })
      servicio: Types.ObjectId;
    
      @Prop()
      diferencia: number;
    
      @Prop()
      comision: number;
    
      @Prop({ type: Date, default: Date.now() })
      fecha: Date;
    
      @Prop({ type: String, enum: flag, default: flag.nuevo })
      flag: flag;
    
}
export const comisionServicioSchema = SchemaFactory.createForClass(ComisionServicio)
comisionServicioSchema.index({precio:1, servicio:1})
