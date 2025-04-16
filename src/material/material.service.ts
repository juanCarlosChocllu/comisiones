import { Injectable } from '@nestjs/common';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Material } from './schema/material.schema';
import { Model } from 'mongoose';

@Injectable()
export class MaterialService {
  constructor(@InjectModel(Material.name) private readonly material:Model<Material>){}
  create(createMaterialDto: CreateMaterialDto) {
    return 'This action adds a new material';
  }

  async guardarMaterial (nombre:string) {
    const material = await this.material.findOne({nombre:nombre.toUpperCase()})
    if(!material) {
      return  await this.material.create({nombre:nombre.toUpperCase()})
    }
    return material
  }

  async verificarMaterial (nombre:string) {
    const material = await this.material.findOne({nombre:nombre.toUpperCase()})
    return material
  }

  findAll() {
    return `This action returns all material`;
  }

  findOne(id: number) {
    return `This action returns a #${id} material`;
  }

  update(id: number, updateMaterialDto: UpdateMaterialDto) {
    return `This action updates a #${id} material`;
  }

  remove(id: number) {
    return `This action removes a #${id} material`;
  }
}
