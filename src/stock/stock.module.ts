import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stock, stockSchema } from './schema/StockSchema';
import { SucursalModule } from 'src/sucursal/sucursal.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Stock.name,
        schema: stockSchema,
      },
    ]),
    SucursalModule
  ],
  controllers: [StockController],
  providers: [StockService],
  exports:[StockService]
})
export class StockModule {}
