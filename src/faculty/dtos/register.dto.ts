import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    readonly token:string;

    @IsNotEmpty()
    @IsStrongPassword()
    readonly password:string;
}



