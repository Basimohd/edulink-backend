import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'otp' })
export class otp extends Document {

  @Prop({type:Types.ObjectId,ref:'students'})
  userId: ObjectId;

  @Prop()
  otp: string;

  @Prop()
  createdAt: Date;

  @Prop()
  expiresAt: Date;


}
export const otpSchema = SchemaFactory.createForClass(otp);
