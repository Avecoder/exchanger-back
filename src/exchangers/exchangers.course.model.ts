import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";




@Schema({collection: 'course'})
export class Course {
    @Prop({ required: true, type: String })
    title: string;

    @Prop({ required: true, type: String })
    value: string;

}


export type CourseDocument = Course & Document

export const CourseSchema = SchemaFactory.createForClass(Course)


