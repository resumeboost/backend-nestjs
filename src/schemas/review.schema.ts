import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ unique: true })
  revieweeId: string;

  @Prop({ unique: true })
  reviewerId: string;

  @Prop({ unique: true })
  resumeId: string;

  @Prop()
  info: {
    visual: number;
    content: number;
    relevance: number;
    feedback: string;
  }[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
