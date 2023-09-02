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
import { communityChatSchema } from '../models/community-chat.schema';
import { groupChatSchema } from '../models/group-chat.schema';
import { facultySchema } from '../models/faculty.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:'admissionEnquiry',schema:AdmissionSchema},
        {name:'otp',schema:otpSchema},
        {name:'students',schema:studentSchema},
        {name:'department',schema:departmentSchema},
        {name:'batch',schema:batchSchema},
        {name:'assignment',schema:assignmentSchema},
        {name:'communityChat',schema:communityChatSchema},
        {name:'groupChat',schema:groupChatSchema},
        {name:'faculty',schema:facultySchema},
    ]),],
    providers:[UserService],
    controllers:[UserController]
})
export class UserModule {}
