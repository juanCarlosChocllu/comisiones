import { Injectable } from '@nestjs/common';
import { CreateAsesorDto } from './dto/create-asesor.dto';
import { UpdateAsesorDto } from './dto/update-asesor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Asesor } from './schema/asesor.schema';
import { Model } from 'mongoose';

@Injectable()
export class AsesorService {
  constructor(@InjectModel(Asesor.name) private readonly asesor:Model<Asesor>){}
  create(createAsesorDto: CreateAsesorDto) {
    return 'This action adds a new asesor';
  }

  findAll() {
    return `This action returns all asesor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} asesor`;
  }

  update(id: number, updateAsesorDto: UpdateAsesorDto) {
    return `This action updates a #${id} asesor`;
  }

  remove(id: number) {
    return `This action removes a #${id} asesor`;
  }


  async guardarAsesor(nombre:string){
    const asesor = await this.asesor.findOne({nombre:nombre.toUpperCase()})
    if(!asesor){
      await this.asesor.create({nombre:nombre.toUpperCase()})
    }
   }
   
}
