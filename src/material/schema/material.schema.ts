import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { flag } from "src/core/enum/flag";

@Schema({collection:'Material'})
export class Material {
    @Prop()
    nombre:string
     @Prop({ type: Date, default: Date.now() })
      fecha: Date;
    
      @Prop({ type: String, enum: flag, default: flag.nuevo })
      flag: flag;
}

export const materialSchema= SchemaFactory.createForClass(Material)