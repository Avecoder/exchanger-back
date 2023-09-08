import { Injectable } from '@nestjs/common';
import { CreateCoinsDto } from "./dtos/create-coins.dto";
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose'
import { Coins, CoinsDocument} from './coins.model'

@Injectable()
export class CoinsService {
  constructor(@InjectModel(Coins.name) private coinsModel: Model<CoinsDocument>) {}

  private async addCoinsData (title: string, value: string) {
    const createdExchanger = await this.coinsModel.create({title, value});

    return createdExchanger.save()
  }

  private mainLoop() {
    
  }

  async create() {
    const currencies: string[] = ['Bitcoin (BTC)', 'Ethereum (ETH)', 'Ripple (XRP)', 'Litecoin (LTC)', 'Binance Coin (BNB)', 'Tether (USDT)', 'Monero (XMR)', 'Tron (TRX)', 'Dash (DASH)', 'Dogecoin (DOGE)', 'Solana (SOL)'];
    const services: string[] = ['wmz', 'qiwi', 'sberbank', 'alfaclick', 'tinkoff'];


    for (const currency of currencies) {
      const currency1 = currency.replace(/\(.*?\)/g, '').toLowerCase().trim().replace(' ', '-');
      const short1 = currency.split('(')[1].split(')')[0];
    
      for (const service of services) {
        const service1 = service;
    
        await this.addCoinsData(`${short1}-${service1.toUpperCase()}`, `${currency1}-to-${service1}`);
        await this.addCoinsData(`${service1.toUpperCase()}-${short1}`, `${service1}-to-${currency1}`);
      }

      for (const currency2 of currencies.slice(currencies.indexOf(currency) + 1)) {
        const currency2Lower = currency2.toLowerCase().replace(/\(.*?\)/g, '').trim().replace(' ', '-');
        const short2 = currency2.split('(')[1].split(')')[0];
  
        await this.addCoinsData(`${short1}-${short2}`, `${currency1}-to-${currency2Lower}`);
        await this.addCoinsData(`${short2}-${short1}`, `${currency2Lower}-to-${currency1}`);
      }
    }

    return 'Create all variants'
  }

  async getAllData() {
    const allData = await this.coinsModel.find()

    return allData
  }

  async getDataByTitle(title: string) {
    const data = await this.coinsModel.findOne({title})

    return data
  }
}
