import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({collection:'Zona'})
export class Zona {

    @Prop()
    nombre:string

    
    
}

export const zonaSchema = SchemaFactory.createForClass(Zona)