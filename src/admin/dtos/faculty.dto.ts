import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class facultyDto {

    @IsNotEmpty()
    readonly facultyName:string;

    @IsNotEmpty()
    readonly phoneNumber:string;

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    readonly mainSubject:string;

    profilePicture:string;
}



