import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { batchType } from 'admin/interfaces/batch.interface';
@Schema({ collection: 'batch' })
export class batch extends Document {

  @Prop({ type: Types.ObjectId, ref: 'department' })
  department: ObjectId;

  @Prop({
    type: {
      startYear: Number,
      endYear: Number
    }
  })
  batch: {
    startYear: Number,
    endYear: Number
  }

  @Prop({ type: Types.ObjectId, ref: 'faculty' })
  tutor: ObjectId;

  @Prop()
  maxSeats: number;

}
export const batchSchema = SchemaFactory.createForClass(batch);
