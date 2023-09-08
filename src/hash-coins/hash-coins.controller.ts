import { Body, Controller, Post, Get } from "@nestjs/common";
import { HashCoinsService } from "./hash-coins.service";
import { CreateHashDto } from "./dtos/create-hash.dto";

@Controller('hash-coins')
export class HashCoinsController {
  constructor(private hashCoinsService: HashCoinsService) {}

  @Post()
  create(@Body() token: CreateHashDto) {
    return this.hashCoinsService.create(token)
  }

  @Get()
  getAll() {
    return this.hashCoinsService.getHashCoins()
  }

  @Post('update-course')
  updateCourse() {
    return this.hashCoinsService.createAndUpdateCourse()
  }

  @Get('explorer')
  getExplorer() {
    return this.hashCoinsService.getExplorer()
  }
}
