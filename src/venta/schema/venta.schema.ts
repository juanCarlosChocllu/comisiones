import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';

@Schema({ collection: 'Venta' })
export class Venta {
  @Prop()
  id_venta: string;

  @Prop()
  montoTotal: number;

  @Prop({ type: Types.ObjectId, ref: 'Asesor' })
  asesor: Types.ObjectId;

  @Prop()
  descuento: number;

  @Prop()
  comisiona: boolean;

  @Prop()
  tieneReceta: boolean;

  @Prop()
  tieneProductos: boolean;

     @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;


  @Prop()
  fechaVenta: Date;
         
  @Prop()
  fechaFinalizacion: Date;

   @Prop({ type: Date, default: Date.now() })
    fecha: Date;
         
    @Prop()
    flag: string;
  

}

export const ventaSchema = SchemaFactory.createForClass(Venta);


@Schema({ collection: 'DetalleVenta' })
export class DetalleVenta {
  @Prop()
  venta: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CombinacioReceta' })
  combinacionReceta: Types.ObjectId;

  @Prop()
  importe: number;

  @Prop()
  cantidad: number;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;

  @Prop()
  rubro: string;
}

export const detalleVentaSchema = SchemaFactory.createForClass(DetalleVenta);
