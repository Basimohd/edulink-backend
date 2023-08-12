import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'admins' })
export class admin extends Document {

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;
}
export const adminSchema = SchemaFactory.createForClass(admin);
