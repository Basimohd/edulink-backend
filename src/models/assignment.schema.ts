    import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
    import { AssignmentStatus, assignmentDetailType } from '../common/interfaces/assignment.interface';
    import { FeeForDuration } from 'common/interfaces/fees.interface';
    import { Document, ObjectId, Types } from 'mongoose';
    @Schema({ collection: 'assignment' })
    export class assignment extends Document {

        @Prop({ type: Types.ObjectId, ref: 'faculty' })
        facultyId: ObjectId;

        @Prop({ type: Types.ObjectId, ref: 'department' })
        department: ObjectId;

        @Prop()
        title: string;

        @Prop()
        description: string;

        @Prop({ required: true })
        dueDate: Date;

        @Prop({ default: AssignmentStatus.OPEN }) 
        status: AssignmentStatus;

        @Prop([{ 
            studentId: { type: Types.ObjectId, ref: 'students' },
            fileUrl: Array<String>, 
            grade: Number,
            isGraded:Boolean,
            lastUpdated:Date
        }])
        submissions: {
            studentId: ObjectId;
            fileUrl: string[];
            grade: number;
            isGraded:boolean;
            lastUpdated:Date
        }[];

        

    }

    export const assignmentSchema = SchemaFactory.createForClass(assignment);

    assignmentSchema.pre<assignment>('save', function(next) {
        if (this.isModified('dueDate') && this.dueDate <= new Date()) {
            this.status = AssignmentStatus.CLOSED;
        }
        next();
    });