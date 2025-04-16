import { Injectable } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Color } from './schema/color.schema';
import { Model } from 'mongoose';

@Injectable()
export class ColorService {
  constructor(@InjectModel(Color.name)  private readonly  color:Model<Color> ){}
  create(createColorDto: CreateColorDto) {
    return 'This action adds a new color';
  }

  findAll() {
    return `This action returns all color`;
  }

  findOne(id: number) {
    return `This action returns a #${id} color`;
  }

  update(id: number, updateColorDto: UpdateColorDto) {
    return `This action updates a #${id} color`;
  }

  remove(id: number) {
    return `This action removes a #${id} color`;
  }

  
  async guardarColor(nombre:string){
    const color= await this.color.findOne({nombre:nombre.toUpperCase()})
    if(!color){
      return await this.color.create({nombre:nombre})
    } 
    return color
  }
}
