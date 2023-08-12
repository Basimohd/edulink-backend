import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { admissionStatus } from '../admin/enums/admissionStatus.enum';
import { admissionType } from '../user/enums/admissionType.enum';
import { admissionQouta } from '../user/enums/admissionQuota.enum';
import { ObjectId } from 'mongoose';
@Schema({ collection: 'admissionEnquiry' })
export class Admission extends Document {

  @Prop({ unique: true, minlength: 6, maxlength: 6, type: Number })
  admissionId: number;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  studentEmail: string;

  @Prop()
  dob: Date;

  @Prop()
  gender: string;

  @Prop()
  studentPhone: number;

  @Prop()
  address: string;

  @Prop({ type: Types.ObjectId, ref: 'department' })
  department: ObjectId;
  

  @Prop({ type: String, enum: Object.values(admissionQouta) })
  quota: admissionQouta;

  @Prop({ type: String, enum: Object.values(admissionType) })
  admissionType: admissionType;

  @Prop()
  guardianName: string;

  @Prop()
  relation: string;

  @Prop()
  occupation: string;

  @Prop()
  guardianPhone: number;

  @Prop()
  previousInstitute: string;

  @Prop()
  courseStudied: string;

  @Prop()
  passingYear: string;

  @Prop({ default: new Date() })
  admissionDate: Date;

  @Prop()
  profilePicture: string;

  @Prop({ type: String, enum: Object.values(admissionStatus), default: admissionStatus.PENDING })
  admissionStatus: admissionStatus; 

  
}
export const AdmissionSchema = SchemaFactory.createForClass(Admission);
