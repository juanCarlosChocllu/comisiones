import { Module } from '@nestjs/common';
import { RangoComisionService } from './rango-comision.service';
import { RangoComisionController } from './rango-comision.controller';

@Module({
  controllers: [RangoComisionController],
  providers: [RangoComisionService],
})
export class RangoComisionModule {}
