import { IsNotEmpty } from 'class-validator';

export class createGroupDto {
    @IsNotEmpty()
    readonly groupName:string;

    @IsNotEmpty()
    readonly communityId:string;

    @IsNotEmpty()
    readonly studentParticipants:string[];

    @IsNotEmpty()
    readonly facultyParticipants:string[];

}



