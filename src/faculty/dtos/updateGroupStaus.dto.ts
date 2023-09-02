import { IsNotEmpty } from 'class-validator';
import { CommonStatus } from '../../common/enums/leave-status.enum';

export class updateGroupStatusDto {
    @IsNotEmpty()
    readonly status:CommonStatus;


    @IsNotEmpty()
    readonly groupId:string;

}



