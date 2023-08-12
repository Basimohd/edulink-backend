import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdmissionSchema } from '../models/admission.schema';
import { adminSchema } from '../models/admin.schema';
import { facultySchema } from '../models/faculty.schema';
import { departmentSchema } from '../models/department.schema';
import { batchSchema } from '../models/batch.schema';
import { studentSchema } from '../models/student.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:'admissionEnquiry',schema:AdmissionSchema},
        {name:'admins',schema:adminSchema},
        {name:'faculty',schema:facultySchema},
        {name:'department',schema:departmentSchema},
        {name:'batch',schema:batchSchema},
        {name:'students',schema:studentSchema}
    ]),],
    providers:[AdminService],
    controllers:[AdminController]
})
export class AdminModule {}
