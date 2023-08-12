import { IsNotEmpty } from 'class-validator';

export class leaveApplicationDto {
    @IsNotEmpty()
    readonly startDate:Date;

    @IsNotEmpty()
    readonly endDate:Date;

    @IsNotEmpty()
    readonly totalDays:string;

    @IsNotEmpty()
    readonly reason:string;
}



