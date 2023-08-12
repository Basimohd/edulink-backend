import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { feePaymentDetail, feePaymentDetailType } from '../common/interfaces/feePayment.interface';
import { Document, ObjectId, Types } from 'mongoose';
import { attendance, attendanceDetailType } from '../common/interfaces/attendance.interface';
import { leaveApplication, leaveApplicationDetailType } from '../common/interfaces/leaveApplication.interface';
@Schema({ collection: 'students' })
export class student extends Document {

  @Prop()
  googleId: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'department' })
  department: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'batch' })
  batch: Types.ObjectId;

  @Prop({ default: false })
  isVerified: Boolean;

  @Prop({ type: Types.ObjectId, ref: 'admissionEnquiry' })
  admssionDetails: ObjectId;

  @Prop({
    type: [feePaymentDetailType],
    default: () => ([]),
  })
  feePayments: feePaymentDetail[];

  @Prop({
    type: [attendanceDetailType],
    default: () => ([]),
  })
  attendance:attendance[]
  
  @Prop({
    type: [leaveApplicationDetailType],
    default: () => ([]),
  })
  leaveApplications:leaveApplication[];
}
export const studentSchema = SchemaFactory.createForClass(student);
