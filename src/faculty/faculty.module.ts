import { Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { facultySchema } from '../models/faculty.schema';
import { studentSchema } from '../models/student.schema';
import { departmentSchema } from '../models/department.schema';
import { assignmentSchema } from '../models/assignment.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:'faculty',schema:facultySchema},
        {name:'students',schema:studentSchema},
        {name:'department',schema:departmentSchema},
        {name:'assignment',schema:assignmentSchema},
    ]),],
    providers:[FacultyService],
    controllers:[FacultyController]
})
export class FacultyModule {}
