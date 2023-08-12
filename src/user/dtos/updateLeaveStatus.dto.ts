import { IsNotEmpty } from 'class-validator';

export class updateLeaveStatusDto {
    @IsNotEmpty()
    readonly status:Date;

    @IsNotEmpty()
    readonly studentId:Date;

    @IsNotEmpty()
    readonly leaveId:string;

}



