import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ColorService } from 'src/color/color.service';
import { MarcaService } from 'src/marca/marca.service';
import { TipoMonturaService } from 'src/tipo-montura/tipo-montura.service';
import { PreciosService } from 'src/precios/precios.service';
import { console } from 'inspector';
import { InjectModel } from '@nestjs/mongoose';
import { Producto } from './schema/producto.schema';
import { Model } from 'mongoose';
import { tipoProductoPrecio } from 'src/precios/enum/tipoProductoPrecio';
import { productoE } from 'src/providers/enum/productos';
import { DataProductoI } from './interface/dataProducto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectModel(Producto.name) private readonly prodcuto:Model<Producto>,
    private readonly colorService:ColorService,
    private readonly marcaService:MarcaService,
    private readonly tipoMonturaService:TipoMonturaService,

    private readonly preciosService:PreciosService
    


  ){}
  async create(createProductoDto: CreateProductoDto) {
    for (const data of createProductoDto.data) {
      const color = await this.colorService.guardarColor(data.color)
      const marca = await this.marcaService.guardarMarca(data.marca)

      const dataProducto:DataProductoI ={
        codigoMia:data.codigoMia,
        tipoProducto:data.tipoProducto,
        marca:marca._id,
        color:color._id,
        serie:data.serie,
        categoria:data.categoria,
        codigoQR:data.codigoQR,
        estuchePropio:data.estuchePropio,
      
      }
      if(data.tipoProducto == productoE.montura){ 
         const tipoMontura = await this.tipoMonturaService.guardarTipoMontura(data.tipoMontura) 
        dataProducto.tipoMontura = tipoMontura._id
      }
      const producto = await this.prodcuto.create(dataProducto)
    for (const p of data.precios) {
 
      const precio = await this.preciosService.guardarPrecioReceta(p.tipoPrecio, p.precio)
      await this.preciosService.guardarDetallePrecio(tipoProductoPrecio.producto, producto._id, precio._id)
      
    }  
    
    }
    return {status:HttpStatus.CREATED}
  }

  findAll() {
    return `This action returns all producto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }
}
