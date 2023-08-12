import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'faculty' })
export class faculty extends Document {

  @Prop()
  facultyId:string;

  @Prop()
  facultyName:string;

  @Prop()
  phoneNumber:string;

  @Prop()
  email: string;

  @Prop()
  mainSubject:string;

  @Prop({default:Date.now()})
  joinedAt:Date;

  @Prop()
  profilePicture:string;

  @Prop({default:false})
  isHOD:boolean;

  @Prop({default:false})
  isBlocked:boolean;

  @Prop()
  password: string;
}
export const facultySchema = SchemaFactory.createForClass(faculty);
