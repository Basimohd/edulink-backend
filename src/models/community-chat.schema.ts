import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'communityChat' })
export class communityChat extends Document {

  @Prop({type:Types.ObjectId,ref:'department'})
  departmentId: ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'groupChat' })
  groups: ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'messages' })
  messages: ObjectId[];

  @Prop()
  profilePicture: string;

}
export const communityChatSchema = SchemaFactory.createForClass(communityChat);
