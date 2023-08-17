import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AdmissionSchema } from '../models/admission.schema';
import { otpSchema } from '../models/otp.schema';
import { studentSchema } from '../models/student.schema';
import { departmentSchema } from '../models/department.schema';
import { batchSchema } from '../models/batch.schema';
import { assignmentSchema } from '../models/assignment.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:'admissionEnquiry',schema:AdmissionSchema},
        {name:'otp',schema:otpSchema},
        {name:'students',schema:studentSchema},
        {name:'department',schema:departmentSchema},
        {name:'batch',schema:batchSchema},
        {name:'assignment',schema:assignmentSchema},
    ]),],
    providers:[UserService],
    controllers:[UserController]
})
export class UserModule {}
