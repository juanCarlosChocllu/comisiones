import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DateTime } from 'luxon';
import { Types } from 'mongoose';

import { FinalizarVentaI } from '../interface/venta';

@Schema({ collection: 'Venta' })
export class Venta {
  @Prop()
  id_venta: string;
  @Prop()
  montoTotal: number;

  @Prop()
  precioTotal: number;
  @Prop({ type: Types.ObjectId, ref: 'Asesor' })


  asesor: Types.ObjectId;

  @Prop()
  descuento: number;

  @Prop()
  comisiona: boolean;

  @Prop()
  tieneReceta: boolean;

  @Prop()
  tieneProducto: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Sucursal' })
  sucursal: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TipoVenta' })
  tipoVenta: Types.ObjectId;

  @Prop()
  tipo: string;

  @Prop()
  tipo2: string;

  @Prop()
  nombrePromocion: string;

  @Prop()
  tipoDescuento: string;

  @Prop()
  descuentoPromocion: number;

  @Prop()
  descuentoPromocion2: number;

  @Prop()
  precio: string;

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
ventaSchema.index({ asesor: 1, fechaFinalizacion: 1, flag: 1 });
ventaSchema.index({ asesor: 1, fechaFinalizacion: 1, tipoVenta: 1, flag: 1 });
ventaSchema.index({ id_venta: 1 });

ventaSchema.pre('save', function (next) {
  if (this.fechaVenta) {
    const fechaEnBolivia = DateTime.fromJSDate(this.fechaVenta).setZone(
      'America/La_Paz',
    );

    const fechaFalsaUTC = DateTime.fromObject(
      {
        year: fechaEnBolivia.year,
        month: fechaEnBolivia.month,
        day: fechaEnBolivia.day,
        hour: fechaEnBolivia.hour,
        minute: fechaEnBolivia.minute,
        second: fechaEnBolivia.second,
        millisecond: fechaEnBolivia.millisecond,
      },
      { zone: 'utc' },
    );
    this.fechaVenta = fechaFalsaUTC.toJSDate();
  }

  if (this.fechaFinalizacion) {
    const fechaEnBolivia = DateTime.fromJSDate(this.fechaFinalizacion).setZone(
      'America/La_Paz',
    );
    const fechaFalsaUTC = DateTime.fromObject(
      {
        year: fechaEnBolivia.year,
        month: fechaEnBolivia.month,
        day: fechaEnBolivia.day,
        hour: fechaEnBolivia.hour,
        minute: fechaEnBolivia.minute,
        second: fechaEnBolivia.second,
        millisecond: fechaEnBolivia.millisecond,
      },
      { zone: 'utc' },
    );

    this.fechaFinalizacion = fechaFalsaUTC.toJSDate();
  }

  next();
});

ventaSchema.pre('updateOne', function (next) {
  const data: FinalizarVentaI = this.getUpdate() as FinalizarVentaI;

  if (data.fechaFinalizacion) {
    const fechaEnBolivia = DateTime.fromJSDate(data.fechaFinalizacion).setZone(
      'America/La_Paz',
    );
    const fechaFalsaUTC = DateTime.fromObject(
      {
        year: fechaEnBolivia.year,
        month: fechaEnBolivia.month,
        day: fechaEnBolivia.day,
        hour: fechaEnBolivia.hour,
        minute: fechaEnBolivia.minute,
        second: fechaEnBolivia.second,
        millisecond: fechaEnBolivia.millisecond,
      },
      { zone: 'utc' },
    );

    data.fechaFinalizacion = fechaFalsaUTC.toJSDate();
  }

  next();
});

@Schema({ collection: 'DetalleVenta' })
export class DetalleVenta {
  @Prop({ type: Types.ObjectId, ref: 'Venta' })
  venta: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CombinacioReceta' })
  combinacionReceta: Types.ObjectId;

  @Prop()
  importe: number;

  @Prop()
  cantidad: number;

  @Prop()
  descripcion: string;

  @Prop()
  marca: string;

  // @Prop()
  //comision:number[]
  @Prop({ type: Boolean })
  medioPar: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Producto' })
  producto: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Servicio' })
  servicio: Types.ObjectId;

  @Prop()
  rubro: string;
}

export const detalleVentaSchema = SchemaFactory.createForClass(DetalleVenta);
detalleVentaSchema.index({ venta: 1 });

