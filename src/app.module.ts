import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { CoinsModule } from './coins/coins.module';
import {ConfigModule} from "@nestjs/config";
import { HashCoinsModule } from './hash-coins/hash-coins.module';
import { ExchangersModule } from './exchangers/exchangers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.development.env`
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@exchangers.vspue78.mongodb.net/ano-exchangers`),
    CoinsModule,
    HashCoinsModule,
    ExchangersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
