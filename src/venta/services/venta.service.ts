import { Injectable } from '@nestjs/common';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { UpdateVentaDto } from '../dto/update-venta.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Venta } from '../schema/venta.schema';
import { Model, Types } from 'mongoose';
import { VentaI } from '../interface/venta';
import { AsesorService } from 'src/asesor/asesor.service';
import { DetalleVentaService } from './detallleVenta.service';
import { CombinacionReceta } from 'src/combinacion-receta/schema/combinacion-receta.schema';
import { CombinacionRecetaService } from 'src/combinacion-receta/combinacion-receta.service';
import { productoE } from 'src/providers/enum/productos';
import { ComisionReceta } from 'src/comision-receta/schema/comision-receta.schema';
import { ComisionRecetaService } from 'src/comision-receta/comision-receta.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectModel(Venta.name) private readonly venta:Model<Venta>,
    private readonly asesorService:AsesorService,
    private readonly detalleVentaService:DetalleVentaService,
    private combinacionRecetaService :CombinacionRecetaService,
    private comisionRecetaService :ComisionRecetaService,
  ){}
  create(createVentaDto: CreateVentaDto) {
    return 'This action adds a new venta';
  }

 async  listarVentas() {
    const asesores = await this.asesorService.listarAsesor()
    const data:any[]=[]
    for (const asesor of asesores) {
      const ventaAsesor={
          sucursal:asesor.sucursalNombre,
          asesor:asesor.nombre,
          ventas:[]
         
      }
      const ventas = await this.venta.find({asesor:asesor._id})
      
      for (const venta of ventas) {
          const detalles = await this.detalleVentaService.listarDetalleVenta(venta._id)
          const ventaData={
              idVenta:venta.id_venta,
              lente:[],
              prodcutos:[]
              
          }
          for (const detalle of detalles) {
            if(detalle.rubro === productoE.lente){
             const combinacion=  await  this.combinacionRecetaService.listarComninacionPorVenta(detalle.combinacionReceta)
              const comision = await this.comisionRecetaService.listarComisionReceta(combinacion._id)
             const ventaCombiancion={
              combinacion,
              importe:detalle.importe,
              comision:comision
             } 
             
             ventaData.lente.push(ventaCombiancion)
              
            }else {
              console.log('producto');
              
            }
          
          }
        ventaAsesor.ventas.push(ventaData)
      }
      data.push(ventaAsesor)
    }
    return data;
  }

  findOne(id: number) {
    return `This action returns a #${id} venta`;
  }

  update(id: number, updateVentaDto: UpdateVentaDto) {
    return `This action updates a #${id} venta`;
  }

  remove(id: number) {
    return `This action removes a #${id} venta`;
  }

   async guardarVenta(venta:VentaI){
    const v = await this.venta.findOne({id_venta:venta.id_venta.toUpperCase()})
    if(!v) {
      return await this.venta.create(venta)
    }
    return v
  }


  async tieneReceta(id:Types.ObjectId, tieneRecereta:boolean){
    const v = await this.venta.findOne({_id:id})
    if(v) {
      return await this.venta.updateOne({_id:id},{tieneReceta:tieneRecereta})
    }
  }

  
  async tieneProducto(id:Types.ObjectId, tieneProducto:boolean){
    const v = await this.venta.findOne({_id:id})
    if(v) {
      return await this.venta.updateOne({_id:id},{tieneProducto:tieneProducto})
    }
   
  }
}
