import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseSchema } from "src/core/schema/BaseSchema";

@Schema({collection:'Almacen'})
export class Almacen extends BaseSchema {
    @Prop()
    nombre:string
}
export const almacenSchema = SchemaFactory.createForClass(Almacen)