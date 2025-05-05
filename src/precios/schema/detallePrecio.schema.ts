import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({collection:'DetallePrecio'})
export class DetallePrecio {
    @Prop({ref:'Producto', type:Types.ObjectId})
    producto:Types.ObjectId
    
    @Prop({ref:'CombinacionReceta', type:Types.ObjectId})
    combinacionReceta:Types.ObjectId

    @Prop({ref:'Precio', type:Types.ObjectId})
    precio:Types.ObjectId

    @Prop()
    monto:number

    @Prop()
    tipo:string
    
}
export const DetallePrecioSchema = SchemaFactory.createForClass(DetallePrecio)