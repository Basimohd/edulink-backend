import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { attendanceStatus } from '../../common/enums/attendance-status.enum';

export class AssignmentDto {
    @IsNotEmpty()
    readonly department:string;

    @IsNotEmpty()
    readonly title:string;

    @IsNotEmpty()
    readonly description:string;

    @IsNotEmpty()
    readonly dueDate:string;
}


