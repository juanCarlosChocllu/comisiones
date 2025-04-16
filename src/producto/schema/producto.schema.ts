import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"

@Schema({collection:'Producto'})
export class Producto {
    @Prop()
    tipoProducto:string
    @Prop()
    marca:Types.ObjectId
    @Prop()
    serie:string
    @Prop()
    color:Types.ObjectId
    @Prop()
    tipoMontura:Types.ObjectId
    @Prop()
    categoria:string
    @Prop()
    codigoQR:string
    @Prop()
    descripcion:string
    @Prop()
    tamano:string

   
    @Prop()
    estuchePropio:boolean
}

export const  productoSchema = SchemaFactory.createForClass(Producto)
