import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop()
  revieweeId: string;

  @Prop()
  reviewerId: string;

  @Prop()
  resumeId: string;

  @Prop()
  visual: number;

  @Prop()
  content: number;

  @Prop()
  relevance: number;

  @Prop()
  feedback: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
