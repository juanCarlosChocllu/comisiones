import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Log } from './schema/log.Schema';
import { Model } from 'mongoose';
import { LogActividadI, LogI } from './interface/log';
import { LogActividad } from './schema/logActividad';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name) private readonly Log: Model<Log>,
    @InjectModel(LogActividad.name)
    private readonly logActividad: Model<LogActividad>,
  ) {}

  async registrarLog(data: LogI) {
    try {
      await this.Log.create(data);
    } catch (error) {
      console.log(error);
    }
  }

  async registrarActividad(data: LogActividadI) {
    return this.logActividad.create(data);
  }
}
