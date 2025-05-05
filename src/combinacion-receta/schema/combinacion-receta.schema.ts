import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"
import { flag } from "src/core/enum/flag"

@Schema({collection:'CombinacionReceta'})
export class CombinacionReceta {
    @Prop()
    codigo:string

    @Prop()
    codigoMia:string
    
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

    @Prop({type:Types.ObjectId, ref:'TipoColorLente'})
    tipoColorLente:Types.ObjectId

    @Prop()
    comision:boolean

    @Prop()
    monto:number

    @Prop({ type: Date, default: Date.now() })
    fecha: Date;
        
    @Prop({ type: String, enum: flag, default: flag.nuevo })
    flag: flag;
}

export const combinacionRecetaSchema = SchemaFactory.createForClass(CombinacionReceta) 




combinacionRecetaSchema.index({ flag: 1 })
combinacionRecetaSchema.index({ material: 1 })
combinacionRecetaSchema.index({ tipoLente: 1 })
combinacionRecetaSchema.index({ rango: 1 })
combinacionRecetaSchema.index({ colorLente: 1 })
combinacionRecetaSchema.index({ marcaLente: 1 })
combinacionRecetaSchema.index({ tratamiento: 1 })
combinacionRecetaSchema.index({ tipoColorLente: 1 })





