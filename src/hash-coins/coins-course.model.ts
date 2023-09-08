import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';


@Schema({collection: 'coins-course'})
export class CoinsCourse {

  @Prop({ required: true, type: String })
  title: string;

  @Prop({requred: true, type: String})
  price: string;

  @Prop({requred: true, type: String})
  percent: string;

  @Prop({requred: true, type: String})
  progress: string;

  @Prop({requred: true, type: String})
  image: string;
}

export type CoinsDocument = CoinsCourse & Document


export const CoinsCourseSchema = SchemaFactory.createForClass(CoinsCourse)