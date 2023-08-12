import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { attendanceStatus } from '../../common/enums/attendance-status.enum';

export class AttendanceDto {
    @IsNotEmpty()
    readonly studentId:string;

    @IsNotEmpty()
    readonly studentAtendance:attendanceStatus;

    @IsNotEmpty()
    readonly selectedDate:Date;
}


