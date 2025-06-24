import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, logSchema } from './schema/log.Schema';

@Module({
   imports:[
      MongooseModule.forFeature([
        {
          name:Log.name, schema:logSchema
        }
      ])
    ],
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
