import { admissionStatus } from "admin/enums/admissionStatus.enum";


export class AdmissionUpdateDto {
  status: admissionStatus;
  departmentBatch: {
    department:string;
    batch:string
  };
}