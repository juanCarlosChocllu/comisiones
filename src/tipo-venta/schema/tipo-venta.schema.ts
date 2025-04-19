import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({collection:'TipoVenta'})
export class TipoVenta {
    @Prop()
    nombre:string
}
export const tipoVentaSchema = SchemaFactory.createForClass(TipoVenta) 
