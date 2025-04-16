import { Injectable } from '@nestjs/common';
import { CreateMarcaLenteDto } from './dto/create-marca-lente.dto';
import { UpdateMarcaLenteDto } from './dto/update-marca-lente.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MarcaLente } from './schema/marca-lente.entity';
import { Model } from 'mongoose';

@Injectable()
export class MarcaLenteService {
  constructor(@InjectModel(MarcaLente.name) private readonly marcaLente:Model<MarcaLente>){}
    
    async guardarMarcaLente (nombre:string) {
      const marcaLente = await this.marcaLente.findOne({nombre:nombre.toUpperCase()})
      if(!marcaLente) {
        return await this.marcaLente.create({nombre:nombre.toUpperCase()})
      }
      return marcaLente
    }
    async verificarMarcaLente (nombre:string) {
      const marcaLente = await this.marcaLente.findOne({nombre:nombre.toUpperCase()})
      return marcaLente
    }
  create(createMarcaLenteDto: CreateMarcaLenteDto) {
    return 'This action adds a new marcaLente';
  }

  findAll() {
    return `This action returns all marcaLente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} marcaLente`;
  }

  update(id: number, updateMarcaLenteDto: UpdateMarcaLenteDto) {
    return `This action updates a #${id} marcaLente`;
  }

  remove(id: number) {
    return `This action removes a #${id} marcaLente`;
  }
}
