import { Injectable } from '@nestjs/common';
import { CreateHashDto } from "./dtos/create-hash.dto";
import { InjectModel } from "@nestjs/mongoose";
import axios from 'axios'
import { Model } from "mongoose";
import { HashCoins, HashDocument } from "./hash-coins.model";
import { CreateCoinsDto } from "./dtos/create-coins.dto";
import { CoinsCourse, CoinsDocument } from "./coins-course.model";
import cheerio from 'cheerio'

@Injectable()
export class HashCoinsService {
  constructor(
    @InjectModel(HashCoins.name) private hashCoinsModel: Model<HashDocument>,
    @InjectModel(CoinsCourse.name) private coinsCourseModel: Model<CoinsDocument>
  ) {}


  async create(hashData: CreateHashDto) {

    const createdToken = await this.hashCoinsModel.create(hashData)

    return createdToken.save()
  }

  async getHashCoins() {
    const hashCoins = await this.hashCoinsModel.find()

    return hashCoins
  }

  private async getBlockchairData() {
    const res = await axios.get(`https://blockchair.com/`)

    const $ = cheerio.load(res.data)

    const rows = $('.hp-explore__cards-wrap a')

    let blockchair = []

    rows.each((i, row) => {
      const title = $(row).find('h5')
      const price = $(row).find('.price-usd span').text().trim()

      let cloneTitle = title.clone()
      cloneTitle.find('sup').remove()

      const percent = $(row).find('.price-change__value span').eq(0).text().trim()
      const progress = $(row).find('.price-change span').eq(1).attr('style').split(':')[1]
      const image = $(row).find('img').attr('src').split('?_')[0]

      blockchair.push({
        title: cloneTitle.text().trim(),
        price,
        percent,
        progress: (progress === '#FF2626' ? 'down' : 'top'),
        image
      })

    })

    return blockchair
  }


  async createAndUpdateCourse() {
    const data = await this.getBlockchairData()

    for(const coin of data) {
      let currentCoin = await this.coinsCourseModel.findOne({title: coin.title})

      if(!currentCoin) {
        await this.coinsCourseModel.create(coin)
        continue
      }

      currentCoin.price = coin.price
      currentCoin.percent = coin.percent
      currentCoin.progress = coin.progress
      
      await currentCoin.save()
    }

    return data
  }


  async getExplorer() {
    const data = await this.coinsCourseModel.find()

    return data
  }
}
