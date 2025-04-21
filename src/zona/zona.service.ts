import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Zona } from './schema/zona.schema';
import { Model } from 'mongoose';
import { SucursalService } from 'src/sucursal/sucursal.service';

@Injectable()
export class ZonaService {
  constructor(
    @InjectModel(Zona.name) private readonly zona:Model<Zona>,
    private  readonly sucursalService:SucursalService
  ){}
   async create(createZonaDto: CreateZonaDto) {
    const zona = await  this.zona.create({nombre:createZonaDto.nombre})
    for (const sucursal of createZonaDto.sucursales) {
      await this.sucursalService.asignarZonaSucursal(sucursal, zona._id)
    }
    return {status:HttpStatus.CREATED};
  }

  findAll() {
    return `This action returns all zona`;
  }

  findOne(id: number) {
    return `This action returns a #${id} zona`;
  }

  update(id: number, updateZonaDto: UpdateZonaDto) {
    return `This action updates a #${id} zona`;
  }

  remove(id: number) {
    return `This action removes a #${id} zona`;
  }
}
