import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'hash-coins'})
export class HashCoins {
  @Prop({required: true, type: String})
  title: string;
  @Prop({ required: true, type: String })
  value: string;

}

export type HashDocument = HashCoins | Document


export const HashCoinsSchema = SchemaFactory.createForClass(HashCoins)