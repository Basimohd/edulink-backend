import { admissionType } from "user/enums/admissionType.enum";
import { admissionStatus } from "../enums/admissionStatus.enum";


export class CreateAdmissionDto {
    readonly firstName:string;
    readonly lastName:string;
    readonly studentEmail:string;
    readonly dob:Date;
    readonly gender:string;
    readonly studentPhone:number;
    readonly address:string;
    readonly department:string;
    readonly quota:string;
    readonly admissionType:admissionType;
    readonly guardianName:string;
    readonly relation:string;
    readonly occupation:string;
    readonly guardianPhone:number;
    readonly previousInstitute:string;
    readonly courseStudied:string;
    readonly passingYear:string;
    profilePicture:string;
    readonly admissionStatus:admissionStatus;
    userId:string;
}


