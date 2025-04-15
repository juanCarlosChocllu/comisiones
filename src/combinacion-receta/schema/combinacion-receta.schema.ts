import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enum/flag"

@Schema({collection:'CombinacionReceta'})
export class CombinacionReceta {
    @Prop()
    codigo:string

    @Prop({type:Types.ObjectId, ref:'Material'})
    material:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'TipoLente'})
    tipoLente:Types.ObjectId
    
    @Prop({type:Types.ObjectId, ref:'Rango'})
    rango:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'ColorLente'})
    colorLente:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'MarcaLente'})
    marcaLente:Types.ObjectId

    @Prop({type:Types.ObjectId, ref:'Tratamiento'})
    tratamiento:Types.ObjectId

     @Prop({ type: Date, default: Date.now() })
    fecha: Date;
        
    @Prop({ type: String, enum: flag, default: flag.nuevo })
    flag: flag;
}

export const combinacionRecetaSchema = SchemaFactory.createForClass(CombinacionReceta) 










