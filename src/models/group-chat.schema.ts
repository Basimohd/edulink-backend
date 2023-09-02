import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { CommonStatus } from '../common/enums/leave-status.enum';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'groupChat' })
export class groupChat extends Document {

  @Prop()
  groupName: string;

  @Prop({type:Types.ObjectId,ref:'communityChat'})
  communityId: ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'faculty' })
  facultyParticipants: ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'students' })
  studentParticipants: ObjectId[];

  @Prop({ type: [Types.ObjectId], ref: 'messages' })
  messages: ObjectId[];

  @Prop()
  profilePicture: string;

  @Prop({ type: String, enum: Object.values(CommonStatus),default:CommonStatus.Pending })
  isApproved: CommonStatus;

}
export const groupChatSchema = SchemaFactory.createForClass(groupChat);
