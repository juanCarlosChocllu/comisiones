import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockMia } from 'src/providers/interface/stockMia';
import { Stock } from './schema/StockSchema';
import { Model } from 'mongoose';
import { SucursalService } from 'src/sucursal/sucursal.service';

@Injectable()
export class StockService {
    constructor(
        @InjectModel(Stock.name)  private readonly stock:Model<Stock>,
        private readonly sucursalService:SucursalService
     ){}

     async guardarStockMia(data:StockMia[]){
       for (const da  of data) {
        
       }
        
    }
    
}
