import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enum/flag"

@Schema({collection:'Producto'})
export class Producto {

    @Prop()
    codigoMia:string

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
    comision:boolean
    
    @Prop()
    estuchePropio:boolean
    @Prop({type:Date, default:()=> Date.now()})
    fecha:Date


    @Prop({type:String, default:flag.nuevo})
    flag:string
}

export const  productoSchema = SchemaFactory.createForClass(Producto)
productoSchema.index({codigoMia:1})
productoSchema.index({tipoProducto:1})
productoSchema.index({marca:1})
productoSchema.index({color:1})