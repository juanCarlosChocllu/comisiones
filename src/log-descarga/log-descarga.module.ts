import { Module } from '@nestjs/common';
import { LogDescargaService } from './log-descarga.service';
import { LogDescargaController } from './log-descarga.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LogDescarga, logDescargaSchema } from './schema/LogDescarga.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LogDescarga.name,
        schema: logDescargaSchema,
      },
    ]),
  ],
  controllers: [LogDescargaController],
  providers: [LogDescargaService],
  exports: [LogDescargaService],
})
export class LogDescargaModule {}
