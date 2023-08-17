import { Body, Controller, Post, Get, Param, Patch } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { FacultyService } from "./faculty.service";
import { loginDto } from "./dtos/login.dto";
import { AttendanceDto } from "./dtos/attendance.dto";
import { AssignmentDto } from "./dtos/assingment.dto";

@Controller('faculty')
export class FacultyController {
    constructor(private _facultyService: FacultyService) { }
    
    @Post('register')
    async setPassword(@Body() registerForm:RegisterDto){
        return await this._facultyService.setPassword(registerForm);
    }

    @Post('login')
    async verifyLogin(@Body() loginForm:loginDto){
        return await this._facultyService.verifyLogin(loginForm);
    }

    @Post('attendance')
    async updateAttendance(@Body() payload:AttendanceDto){
        return await this._facultyService.updateAttendance(payload)
    }

    @Post('addAssignment/:facultyId')
    async addAssignment(@Body() payload:AssignmentDto,@Param('facultyId') facultyId:string){
        return await this._facultyService.addAssignment(payload,facultyId)
    }

    @Get('deparmtnet/:facultyId')
    async fetchDepartmentByFaculty(@Param('facultyId') facultyId:string){
        return await this._facultyService.fetchDepartmentByFaculty(facultyId)
    }

    @Get('assignment/:facultyId')
    async fetchAssignments(@Param('facultyId') facultyId:string){
        return await this._facultyService.fetchAssignments(facultyId)
    }
    
    @Patch('update-grade/:submissionId')
    async updateGrade(@Param('submissionId') submissionId:string,@Body() grade:{grade:number}){
        console.log(submissionId,grade.grade);
        
        return await this._facultyService.updateGrade(submissionId,grade.grade)
    }
}