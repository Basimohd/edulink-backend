import { Body, Controller, Post, Get, Param, Patch } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { FacultyService } from "./faculty.service";
import { loginDto } from "./dtos/login.dto";
import { AttendanceDto } from "./dtos/attendance.dto";
import { AssignmentDto } from "./dtos/assingment.dto";
import { updateLeaveStatusDto } from "./dtos/updateLeaveStatus.dto";
import { updateGroupStatusDto } from "./dtos/updateGroupStaus.dto";

@Controller('faculty')
export class FacultyController {
    constructor(private _facultyService: FacultyService) { }
    
    @Get(':facultyId')
    async getFacultyData(@Param('facultyId') facultyId:string){
        return this._facultyService.getFacultyData(facultyId)
    }

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

    @Get('students/:facultyId')
    async fetchStudentsByDepartment(@Param('facultyId') facultyId: string){
      try {
        return await this._facultyService.fetchStudentsByDepartment(facultyId)
      } catch (error) {
        console.log(error);
      }
    }

    @Patch('updateLeave')
    async updateLeaveStatus(@Body() updateData : updateLeaveStatusDto){
        return await this._facultyService.updateLeaveStatus(updateData);
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

    @Get('chat/communities/:facultyId')
    async getCommunities(@Param('facultyId') facultyId:string){
        return await this._facultyService.getCommunities(facultyId)
    }

    @Get('chat/groups/:facultyId')
    async getGroups(@Param('facultyId') facultyId:string){
        return await this._facultyService.getGroups(facultyId)
    }

    @Patch('chat/updateGroupStatus')
    async updateGroupStatus(@Body() updateData : updateGroupStatusDto){
        return await this._facultyService.updateGroupStatus(updateData);
    }  

}