import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { assignment, assignmentDetailType } from '../common/interfaces/assignment.interface';
import { FeeForDuration } from 'common/interfaces/fees.interface';
import { Document, ObjectId, Types } from 'mongoose';
@Schema({ collection: 'department' })
export class department extends Document {

    @Prop()
    departmentName: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'faculty' })
    HOD: ObjectId;

    @Prop()
    duration: number;

    @Prop({
        type: [{ type: Object }],
        default: () => ([]),
    })
    fees: FeeForDuration[];

    @Prop({ type: [Types.ObjectId], ref: 'faculty' })
    professors: ObjectId[];

    @Prop({
        type: [assignmentDetailType],
        default: () => ([]),
      })
      assignments:assignment[];
}

export const departmentSchema = SchemaFactory.createForClass(department);
