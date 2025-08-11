import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Precio } from '../schema/precio.schema';
import { Model, Types } from 'mongoose';
import { DetallePrecio } from '../schema/detallePrecio.schema';

import { tipoProductoPrecio } from '../enum/tipoProductoPrecio';
import { preciosI } from '../interface/precios';
import { flag } from 'src/core/enum/flag';

@Injectable()
export class PreciosService {
  constructor(
    @InjectModel(Precio.name) private readonly precio: Model<Precio>,
    @InjectModel(DetallePrecio.name)
    private readonly detallePrecio: Model<DetallePrecio>,
  ) {}

  async guardarPrecioReceta(nombre: string) {
    const precio = await this.precio.findOne({ nombre: nombre.toUpperCase() });
    if (!precio) {
      return await this.precio.create({ nombre: nombre.toUpperCase() });
    }
    return precio;
  }

  async guardarDetallePrecio(
    tipo: tipoProductoPrecio,
    producto: Types.ObjectId,
    precio: Types.ObjectId,
    monto: number = 0,
  ) {
    if (tipo === tipoProductoPrecio.lente) {
      const detalle = await this.detallePrecio.findOne({
        combinacionReceta: new Types.ObjectId(producto),
        precio: new Types.ObjectId(precio),
        tipo: tipo,
        //monto: monto,
      });

      if (!detalle) {
        await this.detallePrecio.create({
          combinacionReceta: new Types.ObjectId(producto),
          precio: new Types.ObjectId(precio),
          tipo: tipo,
          monto: monto | 0,
        });
      }
    } else if (tipo === tipoProductoPrecio.servicio) {
      const detalle = await this.detallePrecio.findOne({
        servicio: new Types.ObjectId(producto),
        precio: new Types.ObjectId(precio),
        tipo: tipoProductoPrecio.servicio,
        //monto: monto,
      });
  
      
      if (!detalle) {
        await this.detallePrecio.create({
          servicio: new Types.ObjectId(producto),
          precio: new Types.ObjectId(precio),
          tipo: tipoProductoPrecio.servicio,
          monto: monto | 0,
        });
      }
    } else {
      const detalle = await this.detallePrecio.findOne({
        producto: new Types.ObjectId(producto),
        precio: new Types.ObjectId(precio),
        tipo: tipoProductoPrecio.producto,
        //monto: monto,
      });
      if (!detalle) {
        await this.detallePrecio.create({
          producto: new Types.ObjectId(producto),
          precio: new Types.ObjectId(precio),
          tipo: tipoProductoPrecio.producto,
          monto: monto|0,
        });
      }
    }
  }

  async detallePrecioCombinacion(combinacion: Types.ObjectId) {
    const detalle = await this.detallePrecio.find({
      combinacionReceta: combinacion,
      tipo: tipoProductoPrecio.lente,
    });
    const dataPrecio: preciosI[] = [];
    for (const data of detalle) {
      const precio = await this.precio.findOne({ _id: data.precio });
      dataPrecio.push(precio);
    }
    return dataPrecio;
  }

  async detallePrecioProducto(producto: Types.ObjectId) {
    const detalle = await this.detallePrecio.find({
      producto: producto,
      tipo: tipoProductoPrecio.producto,
    });
    const dataPrecio: preciosI[] = [];
    for (const data of detalle) {
      const precio = await this.precio.findOne({ _id: data.precio });
      dataPrecio.push(precio);
    }
    return dataPrecio;
  }

  async listarTiposDePrecioCombinacion(id: Types.ObjectId) {
    const precios: preciosI[] = [];
    const detalle = await this.detallePrecio.find({
      combinacionReceta: new Types.ObjectId(id),
      tipo: tipoProductoPrecio.lente,
    });
    for (const data of detalle) {
      const precio = await this.precio.find({ _id: data.precio });
      precios.push(...precio);
    }
    return precios;
  }
  async listarTiposDePrecioProducto(id: Types.ObjectId) {
    const precios: preciosI[] = [];
    const detalle = await this.detallePrecio.find({
      producto: new Types.ObjectId(id),
      tipo: tipoProductoPrecio.producto,
    });
    for (const data of detalle) {
      const precio = await this.precio.find({ _id: data.precio });
      precios.push(...precio);
    }
    return precios;
  }

  async buscarPrecioPorNombre(nombre: string) {

    
    const precio = await this.precio.findOne({ nombre: nombre.toUpperCase() });
    if (!precio) {
      return await this.precio.create({ nombre: nombre.toUpperCase() });
    }

    return precio;
  }

  async listar() {
    const precio = await this.precio.find({flag:flag.nuevo});
    return precio;
  }

  async precioCombinacion(id: Types.ObjectId) {
    const detalle = await this.detallePrecio.aggregate([
      {
        $match: { combinacionReceta: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'precio',
          as: 'precio',
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$precio.nombre', 0] },
          nombre: { $first: { $arrayElemAt: ['$precio.nombre', 0] } },
        },
      },
      {
        $project: {
          nombre: 1,
          //monto:1
        },
      },
    ]);
    return detalle;
  }

  async precioProducto(id: Types.ObjectId) {
    const detalle = await this.detallePrecio.aggregate([
      {
        $match: { producto: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'precio',
          as: 'precio',
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$precio.nombre', 0] },
          nombre: { $first: { $arrayElemAt: ['$precio.nombre', 0] } },
        },
      },
      {
        $project: {
          nombre: 1,
          //monto:1
        },
      },
    ]);
    return detalle;
  }


  async precioServicio(id:Types.ObjectId) {
    const detalle = await this.detallePrecio.aggregate([
      {
        $match: { servicio: new Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'Precio',
          foreignField: '_id',
          localField: 'precio',
          as: 'precio',
        },
      },
      {
        $group: {
          _id: { $arrayElemAt: ['$precio.nombre', 0] },
          nombre: { $first: { $arrayElemAt: ['$precio.nombre', 0] } },
        },
      },
      {
        $project: {
          nombre: 1,
          //monto:1
        },
      },
    ]);
    return detalle;
  }
 
}
