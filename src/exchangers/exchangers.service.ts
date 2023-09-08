import { CoinsService } from './../coins/coins.service';
import { Injectable } from '@nestjs/common'
import { CreateExchangersDto } from "./dtos/create-exchangers.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Exchangers, ExchangersDocument } from "./exchangers.model"
import axios from 'axios'
import puppeteer from "puppeteer"
import cheerio from 'cheerio'
import {Course, CourseDocument} from "./exchangers.course.model";
import * as url from 'url'


@Injectable()
export class ExchangersService {
  constructor(
      @InjectModel(Exchangers.name) private exchangersModel: Model<ExchangersDocument>,
      @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
      private coinsService: CoinsService
  ) {}


  async create(exchanger: CreateExchangersDto) {
    const createdExchanger = await this.exchangersModel.create(exchanger)
    return createdExchanger.save()
  }

  async getAll(offset: number, limit: number, currency: string) {
    const currentCurrency = await this.coinsService.getDataByTitle(currency)


    if(currentCurrency) {
      const exchangers = await this.exchangersModel
                                    .aggregate([
                                      {
                                        $match: {
                                          "coins.id": currentCurrency._id
                                        }
                                      },
                                      {
                                        $sort: {
                                          posReview: -1
                                        }
                                      },
                                      {
                                        $limit: Number(limit)
                                      },
                                      {
                                        $project: {
                                          title: 1,
                                          url: 1,
                                          posReview: 1,
                                          negReview: 1,
                                          coins: {
                                            $filter: {
                                              input: "$coins",
                                              as: "coin",
                                              cond: { $eq: ["$$coin.id", currentCurrency._id] }
                                            }
                                          }
                                        }
                                      }
                                  
                                    ])
                                    .exec()
    

      return exchangers
    }

    
    return []

    
  }



  async getCourse () {
    const res = await axios(process.env.EXCHANGE_URI)
    const $ = await cheerio.load(res.data)
    const value = await $('span[data-test="instrument-price-last"]').text()
    await this.courseModel.updateOne({title: 'usd-to-rub'}, {value})
    const currentCourse = await this.courseModel.findOne({title: 'usd-to-rub'})
    return currentCourse

  }


  

  private async parseExchangers (url: string) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const html = await page.content()
    const $ = cheerio.load(html)
    const data = []

    const rows = $('#content_table tr')

    rows.each((i, row) => {
      const exchanger = $(row).find('.ca').text()
      const link = $(row).find('a[rel="nofollow"]').attr("href")
      const minPrice = $(row).find(".fm1").text().trim()
      const giveCourse = $(row).find(".bi").eq(0).find(".fs").text().trim()
      const giveCurrency = $(row).find(".bi").eq(0).find("small").text().trim()
      const getCourse = $(row).find(".bi").eq(1).text().trim()
      const getCurrency = $(row).find(".bi").eq(1).find("small").text().trim()
      const reserve = $(row).find(".arp").text().trim()
      const posReview = $(row).find(".rwr.pos").text().trim()
      const negReview = $(row).find(".rwl").text().trim()




      data.push({
        exchanger,
        link,
        min: {
          price: minPrice,
          currency: giveCurrency
        },
        give: {
          price: parseFloat(giveCourse.replace(/[^0-9\.]+/g, '')),
          currency: giveCurrency
        },
        get: {
          price: parseFloat(getCourse.replace(/[^0-9\.]+/g, '')),
          currency: getCurrency
        },
        reserve,
        review: {
          posReview,
          negReview
        }
      })
    })

    await browser.close()

    return data.filter(item => item.link)
  }

  private async createArrayExchangers(data: any, coin: any) {
    return data.map(item => {
      return {
        title: item.exchanger,
        url: item.link,
        posReview: Number(item.review.posReview),
        negReview: Number(item.review.negReview),
        coins: [
          {
            id: coin._id,
            min: {
              price: item.min.price,
              currency: item.min.currency
            },
            giveCurrency: {
              price: item.give.price,
              currency: item.give.currency
            },
            getCurrency: {
              price: item.get.price,
              currency: item.get.currency
            },
            reserve: {
              price: item.reserve,
              currency: coin.title.split('-')[0]
            },
            
          }
        ]
      }
    })
  }

  private async updateExchangersDB(data: any, currencyData: any) {
    for(const exchanger of data) {
      const currentCoin = exchanger.coins[0]
      const existingExchanger = await this.exchangersModel.findOne({title: exchanger.title})

      

      if(!existingExchanger) {
        await this.create(exchanger)
        continue
      }


      if(!(existingExchanger.coins.some(coin => coin.id.toString() === currencyData._id.toString()))) {
        existingExchanger.coins.push(currentCoin)
      } else {
        existingExchanger.coins = existingExchanger.coins.map((coin: any) => {
          if (coin.id.toString() === currencyData._id.toString()) {
              return currentCoin
          }
          return coin
        })
      }

  

      await existingExchanger.save()

      
    }
  }

  async updateLink(url: string) {
    try {
      const browser = await puppeteer.launch()
      const page = await browser.newPage()
      await page.goto(url)

      const currentUrl = await page.url();
      
      await browser.close()

      return currentUrl
    } catch(e) {
      console.log(e)
      return url
    }
  }


  async updateLinks() {
    const exchangers = await this.exchangersModel.find()

    const baseUrl = process.env.BASE_HOSTNAME

    for(const exchanger of exchangers) {
      const parsedUrl = url.parse(exchanger.url)

      if(parsedUrl.hostname !== baseUrl) continue

      const updateUrl = await this.updateLink(exchanger.url)

      exchanger.url = updateUrl

      await exchanger.save()
    }

    return 'All links update'
  }



  async parse () {

    const currency = await this.coinsService.getAllData()
    const mainUrl = 'https://www.bestchange.ru/'

    console.log(currency)


    for(const item of currency) {
      const exchangersParseData = await this.parseExchangers(`${mainUrl}${item.value}.html`)
      console.log(`${mainUrl}${item.value}.html`)
      const updateExchangersData = await this.createArrayExchangers(exchangersParseData, item)
      await this.updateExchangersDB(updateExchangersData, item)
    }


    return 'Все спарсено'
  }
}
