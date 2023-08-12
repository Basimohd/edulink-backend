import { attendanceStatus } from "../../common/enums/attendance-status.enum";

export interface attendance {
  date: Date;
  status: attendanceStatus
}

export const attendanceDetailType = {
  date: { type: Date },
  status: { type: String, enum: Object.values(attendanceStatus) },
};