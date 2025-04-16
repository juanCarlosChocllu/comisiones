import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({collection:'Asesor'})
export class Asesor {
    @Prop()
    nombre:string

    @Prop({ref:'Sucursal', type:Types.ObjectId})
    sucursal:Types.ObjectId
}

export const asesorSchema = SchemaFactory.createForClass(Asesor)