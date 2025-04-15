import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({collection:'Venta'})
export class Venta {
    @Prop()
    id_venta:string

    @Prop()
    montoTotal:number

    @Prop({type:Types.ObjectId, ref:'Asesor'})
    asesor:Types.ObjectId
    
    @Prop()
    descuento:number

     @Prop()
    comisiona:boolean

    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:Types.ObjectId
}   

export const ventaSchema = SchemaFactory.createForClass(Venta)