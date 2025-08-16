import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"


@Schema({collection:'RendimientoDiario'})
export class RendimientoDiario {

        @Prop({type:Types.ObjectId,ref:'Sucursal'})
        sucursal:Types.ObjectId

        @Prop({type:Types.ObjectId,ref:'Usuario'})
        usuario:Types.ObjectId

        @Prop()
        antenciones:number

        @Prop()
        segundoPar:number
}

export const rendimientoDiarioSchema=SchemaFactory.createForClass(RendimientoDiario)