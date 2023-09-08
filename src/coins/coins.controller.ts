import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateCoinsDto } from "./dtos/create-coins.dto";
import { CoinsService } from "./coins.service";

@Controller('coins')
export class CoinsController {
  constructor(private coinsService: CoinsService) {}

  @Get()
  test() {
    return 'all is working'
  }

  @Post()
  create() {
    return this.coinsService.create()
  }
}
