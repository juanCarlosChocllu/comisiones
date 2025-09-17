import { SchemaFactory } from "@nestjs/mongoose";
import { Prop, Schema } from "@nestjs/mongoose/dist/decorators";

@Schema({collection:'Color'})
export class Color {
       @Prop()
        nombre:string
    
}

export const colorSchema = SchemaFactory.createForClass(Color)
