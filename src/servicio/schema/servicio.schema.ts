import { Prop, Schema } from "@nestjs/mongoose";
import { flag } from "src/core/enum/flag";

@Schema({collection:'Servicio'})
export class Servicio {
    @Prop()
    nombre:string

    @Prop()
    descripcion:string


      @Prop({type:Date, default:()=> Date.now()})
        fecha:Date
    
    
        @Prop({type:String, default:flag.nuevo})
        flag:string
    
}
