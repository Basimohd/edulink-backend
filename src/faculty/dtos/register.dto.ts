import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    readonly facultyID:string;

    @IsNotEmpty()
    readonly firstName:string;

    @IsNotEmpty()
    readonly lastName:string;

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @IsStrongPassword()
    readonly password:string;
}



