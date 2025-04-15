import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { flag } from "src/core/enum/flag";

@Schema({collection:'Tratamiento'})
export class Tratamiento {
    @Prop()
    nombre:string
     @Prop({ type: Date, default: Date.now() })
      fecha: Date;
    
      @Prop({ type: String, enum: flag, default: flag.nuevo })
      flag: flag;
}

export const tratamientoSchema= SchemaFactory.createForClass(Tratamiento)