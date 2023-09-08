import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({collection: 'coins'})
export class Coins {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  value: string;
}

export type CoinsDocument = Coins & Document;


export const CoinsSchema = SchemaFactory.createForClass(Coins)