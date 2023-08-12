import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class loginDto {
    @IsNotEmpty()
    readonly facultyID:string;

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @IsStrongPassword()
    readonly password:string;
}



