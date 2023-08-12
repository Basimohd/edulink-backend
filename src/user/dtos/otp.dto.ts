import { IsNotEmpty } from 'class-validator';

export class optDto {
    @IsNotEmpty()
    readonly userId:string;

    @IsNotEmpty()
    readonly otp:string;

}



