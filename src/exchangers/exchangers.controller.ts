import {Body, Controller, Get, Post, Query} from "@nestjs/common";
import { ExchangersService } from "./exchangers.service";
import { CreateExchangersDto } from "./dtos/create-exchangers.dto";
import * as cron from 'node-cron'

@Controller('exchangers')
export class ExchangersController {
  constructor( private exchangersService: ExchangersService) {}


  @Post()
  create(@Body() exchangers: CreateExchangersDto) {
    return this.exchangersService.create(exchangers)
  }

  @Get()
  getExchagers(@Query('offset') offset: number, @Query('limit') limit: number, @Query('currency') currency: string) {
    return this.exchangersService.getAll(offset, limit, currency)
  }

  @Post('/parse')
  parse() {
    return this.exchangersService.parse()
  }

  @Post('/links') 
  updateLinks() {
    cron.schedule('0 * * * *', () => {
      console.log('start update links')
      this.exchangersService.updateLinks()
    })
    return 'start update links'
  }

  @Get('/course')
  course() {
    return this.exchangersService.getCourse()
  }

  

}
