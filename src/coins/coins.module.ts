import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller';
import { CoinsService } from './coins.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Coins, CoinsSchema } from "./coins.model";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Coins.name, schema: CoinsSchema}
    ])
  ],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService]
})
export class CoinsModule {}
