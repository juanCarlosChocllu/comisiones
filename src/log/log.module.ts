import { Global, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { logUsuarioSchema, LogUsuario } from './schema/logUsuario.Schema';
import { LogActividad, LogActividadSchema } from './schema/logActividad';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: LogUsuario.name,
        schema: logUsuarioSchema,
      },
      {
        name: LogActividad.name,
        schema: LogActividadSchema,
      },
    ]),
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
