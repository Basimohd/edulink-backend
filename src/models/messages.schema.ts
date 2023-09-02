import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId, Types } from 'mongoose';

export type messagesDocument = HydratedDocument<messages>;

@Schema({ collection: 'messages' })
export class messages extends Document {

  @Prop({ type: Types.ObjectId, ref: 'faculty' })
  studentSender: ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'students' })
  facultySender: ObjectId;

  @Prop()
  message: string;

  @Prop({default:new Date()})
  timestamp?: Date;

}
export const messagesSchema = SchemaFactory.createForClass(messages);
