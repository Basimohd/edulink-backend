import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateFacultyDto {

    
    @IsNotEmpty()
    readonly facultyId:string;


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



