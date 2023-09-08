import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { Coins } from "../coins/coins.model";

@Schema()
export class Currency {
  @Prop({required: true})
  price: string

  @Prop({required: true})
  currency: string
}


@Schema()
export class Coin {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'coins' })
  id: Coins;

  @Prop({ required: true })
  giveCurrency: Currency

  @Prop({ required: true })
  getCurrency: Currency

  @Prop({ required: true })
  min: Currency

  @Prop({ required: true })
  reserve: Currency
}


@Schema({collection: 'exchangers'})
export class Exchangers {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  url: string;

  @Prop({required: true, type: Number, default: 0})
  posReview: number;

  @Prop({required: true, type: Number, default: 0})
  negReview: number

  @Prop({required: true})
  coins: Coin[]
}


export type ExchangersDocument = Exchangers & Document

export const ExchangersSchema = SchemaFactory.createForClass(Exchangers)


