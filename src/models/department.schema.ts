import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
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
}
export const departmentSchema = SchemaFactory.createForClass(department);
