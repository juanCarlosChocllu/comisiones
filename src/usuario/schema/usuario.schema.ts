import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { flag } from "src/core/enum/flag";



@Schema({collection:'Usuario'})
export class Usuario {

    @Prop()
    nombre:string

    @Prop()
    apellidos:string

    @Prop()
    username:string
    
    @Prop({select:false})
    password:string

    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:Types.ObjectId

    @Prop()
    rol:string
    
    @Prop({type:String, enum:flag, default:flag.nuevo})
    flag:string



}

export const usuariosSchema = SchemaFactory.createForClass(Usuario)