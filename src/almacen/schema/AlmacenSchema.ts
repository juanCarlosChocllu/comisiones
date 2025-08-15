import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { BaseSchema } from "src/core/schema/BaseSchema";

@Schema({collection:'Almacen'})
export class Almacen extends BaseSchema {
    @Prop()
    nombre:string
    
    @Prop({type:Types.ObjectId, ref:'Sucursal'})
    sucursal:Types.ObjectId


}
export const almacenSchema = SchemaFactory.createForClass(Almacen)