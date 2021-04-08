import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  points: number;

  @Prop()
  targetCompanies: string[];

  @Prop()
  targetPositions: string[];

  @Prop()
  resumes: {
    link: string;
    createdAt: Date;
    isActive: boolean;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
