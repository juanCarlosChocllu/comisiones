import { Injectable } from '@nestjs/common';
import { CreateLogDescargaDto } from './dto/create-log-descarga.dto';
import { UpdateLogDescargaDto } from './dto/update-log-descarga.dto';
import { LogDescarga } from './schema/LogDescarga.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class LogDescargaService {
    constructor(
      @InjectModel(LogDescarga.name)
      private readonly logDescarga: Model<LogDescarga>,
  
    ) {}


  
  async registrarLogDescarga(schema:string, fechaDescarga:string){
    await this.logDescarga.create({schema:schema, fechaDescarga:fechaDescarga})
  }

  create(createLogDescargaDto: CreateLogDescargaDto) {
    return 'This action adds a new logDescarga';
  }

  findAll() {
    return `This action returns all logDescarga`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logDescarga`;
  }

  update(id: number, updateLogDescargaDto: UpdateLogDescargaDto) {
    return `This action updates a #${id} logDescarga`;
  }

  remove(id: number) {
    return `This action removes a #${id} logDescarga`;
  }
}
