import { IsNotEmpty } from 'class-validator';

export class fileSubmissionDto {
    @IsNotEmpty()
    readonly fileUrl: string;

    @IsNotEmpty()
    readonly studentId: string;

    @IsNotEmpty()
    readonly assignmentId: string;
}



