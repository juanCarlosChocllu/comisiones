import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'TipoColorLente'})
export class TipoColorLente {
    @Prop()
    nombre:string
}


export const tipoColorLenteSchema= SchemaFactory.createForClass(TipoColorLente)