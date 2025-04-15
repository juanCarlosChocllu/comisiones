import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
@Schema({ collection: 'ComisionReceta' })
export class ComisionReceta {
    @Prop()
    nombre:string

    @Prop()
    monto:string

    @Prop({type:Types.ObjectId, ref:'CombinacionReceta'})
    combinacionReceta:Types.ObjectId
}

export const  comisionRecetaSchema = SchemaFactory.createForClass(ComisionReceta) 