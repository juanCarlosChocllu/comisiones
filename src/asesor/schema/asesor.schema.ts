import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'Asesor'})
export class Asesor {
    @Prop()
    nombre:string
}

export const asesorSchema = SchemaFactory.createForClass(Asesor)