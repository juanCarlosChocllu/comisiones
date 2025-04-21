import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"

@Schema({collection:'MetasProductoVip'})
export class MetasProductoVip {
    @Prop({default:0})
    montura:number

    @Prop({default:0})
    gafa:number

    @Prop({default:0})
    lenteDeContacto:number

    @Prop({ref:'Sucursal', type:Types.ObjectId})
    sucursal:Types.ObjectId
}
export const metasProductoVipSchema = SchemaFactory.createForClass(MetasProductoVip)