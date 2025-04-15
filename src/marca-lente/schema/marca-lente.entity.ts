import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'MarcaLente'})
export class MarcaLente {
    @Prop()
    nombre:string
}

export const marcaLenteSchema = SchemaFactory.createForClass(MarcaLente)