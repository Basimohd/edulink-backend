import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { FeeForDuration } from 'common/interfaces/fees.interface';

export class departmentDto {

    readonly departmentID:string;
    
    @IsNotEmpty()
    readonly departmentName:string;

    @IsNotEmpty()
    readonly description:string;

    @IsNotEmpty()
    readonly HOD:string;

    @IsNotEmpty()
    readonly duration:number;

    readonly fees : FeeForDuration[]
    
    readonly professors : string[]
}



