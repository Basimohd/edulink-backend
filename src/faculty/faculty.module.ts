import { Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { MongooseModule } from '@nestjs/mongoose';
import { facultySchema } from '../models/faculty.schema';
import { studentSchema } from '../models/student.schema';

@Module({
    imports:[MongooseModule.forFeature([
        {name:'faculty',schema:facultySchema},
        {name:'students',schema:studentSchema},

    ]),],
    providers:[FacultyService],
    controllers:[FacultyController]
})
export class FacultyModule {}
