import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class loginDto {

    @IsNotEmpty()
    @IsEmail()
    readonly email:string;

    @IsNotEmpty()
    @IsStrongPassword()
    readonly password:string;
}



