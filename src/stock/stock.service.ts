import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StockMia } from 'src/providers/interface/stockMia';
import { Stock } from './schema/StockSchema';
import { Model } from 'mongoose';

@Injectable()
export class StockService {
    constructor(@InjectModel(Stock.name)  private readonly stock:Model<Stock> ){}

     async guardarStockMia(data:StockMia[]){
        console.log(data);
        
    }
    
}
