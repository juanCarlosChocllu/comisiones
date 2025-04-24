import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'Precio'})
export class Precio {
    @Prop()
    nombre:string
}

export const PrecioSchema = SchemaFactory.createForClass(Precio)