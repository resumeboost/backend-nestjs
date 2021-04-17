import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({
    default: 10,
  })
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
    // TODO: Add OriginalName
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
