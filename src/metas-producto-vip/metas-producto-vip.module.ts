import { Module } from '@nestjs/common';
import { MetasProductoVipService } from './metas-producto-vip.service';
import { MetasProductoVipController } from './metas-producto-vip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MetasProductoVip, metasProductoVipSchema } from './schema/metas-producto-vip.schema';

@Module({
    imports:[MongooseModule.forFeature([{name:MetasProductoVip.name, schema:metasProductoVipSchema}])],
  controllers: [MetasProductoVipController],
  providers: [MetasProductoVipService],
  exports: [MetasProductoVipService],
  
})
export class MetasProductoVipModule {}
