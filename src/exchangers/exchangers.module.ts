import { Module } from '@nestjs/common';
import { ExchangersController } from './exchangers.controller';
import { ExchangersService } from './exchangers.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Exchangers, ExchangersSchema } from "./exchangers.model";
import {Course, CourseSchema} from "./exchangers.course.model";
import { CoinsModule } from 'src/coins/coins.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Exchangers.name, schema: ExchangersSchema},
      {name: Course.name, schema: CourseSchema}
    ]),
    CoinsModule
  ],
  controllers: [ExchangersController],
  providers: [ExchangersService]
})
export class ExchangersModule {}
