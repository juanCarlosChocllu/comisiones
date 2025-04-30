import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Sucursal } from './schema/sucursal.schema';
import { Model, Types } from 'mongoose';
import { flag } from 'src/core/enum/flag';
import { EmpresaService } from 'src/empresa/empresa.service';
import { dataEmpresa } from './util/data';

@Injectable()
export class SucursalService {
  constructor(
    @InjectModel(Sucursal.name)private readonly sucursal:Model<Sucursal>,
    private readonly empresaService:EmpresaService
    
  )
     {}
  create(createSucursalDto: CreateSucursalDto) {
    return 'This action adds a new sucursal';
  }

  async buscarSucursalPorNombre(nombre:string){
    return this.sucursal.findOne({nombre:nombre.toUpperCase()})
  }

  async asignarZonaSucursal (sucursal:Types.ObjectId, zona:Types.ObjectId){
    const s = await this.sucursal.findOne({_id:new Types.ObjectId(sucursal), flag:flag.nuevo})
    if(s){
      return this.sucursal.updateOne({_id: new  Types.ObjectId(sucursal)},{zona:new Types.ObjectId(zona)})
    }
  
  }
  findAll() {
    return `This action returns all sucursal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursal`;
  }

  update(id: number, updateSucursalDto: UpdateSucursalDto) {
    return `This action updates a #${id} sucursal`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursal`;
  }

  public async guardarEmpresaYsusSucursales() {
    const data = dataEmpresa();  
    for (let [empresa, sucursales] of Object.entries(data.empresa)) {
      
      try {
        const empresaCreada = await this.empresaService.guardarEmpresa(empresa)
        
        for (let sucursal of sucursales) {

          const sucursalExiste = await this.sucursal.findOne({
            nombre: sucursal,
          });
  
 
          if (!sucursalExiste) {
            const sucursalData = {
              empresa: empresaCreada._id, 
              nombre: sucursal,
            };
            await this.sucursal.create(sucursalData);
          }
        }
        
      } catch (error) {
        console.error(
          `Error al crear empresa o sucursal para ${empresa}: `,
          error,
        );
      }
    }
  
    return { status: HttpStatus.CREATED };
  }
  

 async  listarSucucrsalPorEmpresa(id:Types.ObjectId){
    const empresa = await this.sucursal.find({empresa:new Types.ObjectId(id)})
    return empresa
  }

  async listarSucursales () {
    return await this.sucursal.find({flag:flag.nuevo})
  }
}
