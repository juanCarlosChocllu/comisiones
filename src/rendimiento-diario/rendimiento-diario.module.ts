import { Module } from '@nestjs/common';
import { RendimientoDiarioService } from './rendimiento-diario.service';
import { RendimientoDiarioController } from './rendimiento-diario.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RendimientoDiario, rendimientoDiarioSchema } from './schema/rendimientoDiarioSchema';

@Module({

  imports:[
    MongooseModule.forFeature([
          {
            name: RendimientoDiario.name,
            schema: rendimientoDiarioSchema,
          },
        ])
  ],
  controllers: [RendimientoDiarioController],
  providers: [RendimientoDiarioService],
})
export class RendimientoDiarioModule {}
