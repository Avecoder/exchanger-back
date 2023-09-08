import { Module } from '@nestjs/common';
import { HashCoinsController } from './hash-coins.controller';
import { HashCoinsService } from './hash-coins.service';
import { MongooseModule } from "@nestjs/mongoose";
import { HashCoins, HashCoinsSchema } from "./hash-coins.model";
import { CoinsCourse, CoinsCourseSchema } from "./coins-course.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: HashCoins.name, schema: HashCoinsSchema},
      {name: CoinsCourse.name, schema: CoinsCourseSchema}
    ])
  ],
  controllers: [HashCoinsController],
  providers: [HashCoinsService]
})
export class HashCoinsModule {}
