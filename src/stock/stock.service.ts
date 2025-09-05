import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockMia } from 'src/providers/interface/stockMia';
import { Stock } from './schema/StockSchema';
import { Model, Types } from 'mongoose';
import { SucursalService } from 'src/sucursal/sucursal.service';
import { AlmacenService } from 'src/almacen/almacen.service';
import { StockI, StockProductoI } from './interface/stock';
import { ProductoService } from 'src/producto/producto.service';
import { CodigoMiaProductoI } from 'src/venta/interface/venta';

@Injectable()
export class StockService {
  constructor(
    @InjectModel(Stock.name) private readonly stock: Model<Stock>,
    private readonly sucursalService: SucursalService,
    private readonly almacenService: AlmacenService,
    private readonly productoService: ProductoService,
  ) {}

  async guardarStockMia(data: StockMia[], venta: CodigoMiaProductoI[]) {
    for (const v of venta) {
      const stock: StockMia[] = [];
      for (const dataMia of data) {
        if (v.codigoMia === dataMia.codigoMiaProducto) {
          stock.push(dataMia);
        }
      }
      /*const dataNueva = {
            producto:v.producto,
            stock:stock
        }*/

      for (const da of stock) {
        if (da.lugar === 'SUCURSAL') {
          const sucursal = await this.sucursalService.vericarSucursalStock(
            da.sucursal,
          );

          if (sucursal) {
            await this.verificarStock(
              da.codigoStockMia,
              da.cantidad,
              v.producto,
              da.lugar,
              sucursal._id,
            );
          }
        } else if (da.lugar === 'ALMACEN') {
          const almacen = await this.almacenService.verificarAlmacen(
            da.almacen,
          );
          await this.verificarStock(
            da.codigoStockMia,
            da.cantidad,
            v.producto,
            da.lugar,
            null,
            almacen._id,
          );
        }
      }
    }
  }

  private async verificarStock(
    codigoStock: string,
    cantidad: number,
    producto: Types.ObjectId,
    tipo: string,
    sucursal?: Types.ObjectId,
    almacen?: Types.ObjectId,
  ) {
    const data: StockI = {
      cantidad: cantidad,
      producto: producto,
      tipo: tipo,
      codigoMia: codigoStock,
      ...(tipo === 'ALMACEN' ? { almacen: almacen } : { sucursal: sucursal }),
    };
    const stock = await this.stock.findOne({ codigoMia: codigoStock });

    if (!stock) {
      await this.stock.create(data);
    } else {
      await this.stock.updateOne({ _id: stock._id }, data);
    }
  }
}
