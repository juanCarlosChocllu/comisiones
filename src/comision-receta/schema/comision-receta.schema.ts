import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
@Schema({ collection: 'ComisionReceta' })
export class ComisionReceta {

    @Prop()
    precio:string

    @Prop()
    nombre:string

    @Prop()
    monto:number

    @Prop({type:Types.ObjectId, ref:'CombinacionReceta'})
    combinacionReceta:Types.ObjectId

    @Prop()
    diferencia:number

    @Prop()
    comision:number

    
}

export const  comisionRecetaSchema = SchemaFactory.createForClass(ComisionReceta) 