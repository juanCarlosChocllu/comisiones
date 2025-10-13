import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, logSchema } from './schema/log.Schema';
import { LogActividad, LogActividadSchema } from './schema/logActividad';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:Log.name, schema:logSchema
        },
         {
          name:LogActividad.name, schema:LogActividadSchema
        }
      ])
    ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
