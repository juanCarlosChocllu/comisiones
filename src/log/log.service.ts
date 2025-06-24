import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './schema/log.Schema';
import { Model } from 'mongoose';
import { LogI } from './interface/log';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly Log: Model<Log>) {}

  async registrarLog(data: LogI) {
    try {
          await this.Log.create(data);
    } catch (error) {
      console.log(error);
      
    }
  }
}
