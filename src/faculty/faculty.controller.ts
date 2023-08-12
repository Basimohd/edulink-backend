import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dtos/register.dto";
import { FacultyService } from "./faculty.service";
import { loginDto } from "./dtos/login.dto";
import { AttendanceDto } from "./dtos/attendance.dto";

@Controller('faculty')
export class FacultyController {
    constructor(private _facultyService: FacultyService) { }
    
    @Post('register')
    async createFaculty(@Body() registerForm:RegisterDto){
        return await this._facultyService.createFaculty(registerForm);
    }

    @Post('login')
    async verifyLogin(@Body() loginForm:loginDto){
        return await this._facultyService.verifyLogin(loginForm);
    }

    @Post('attendance')
    async updateAttendance(@Body() payload:AttendanceDto){
        return await this._facultyService.updateAttendance(payload)
    }
}