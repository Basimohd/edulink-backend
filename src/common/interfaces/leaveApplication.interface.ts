import { leaveApplicationStatus } from "../../common/enums/leave-status.enum";

export interface leaveApplication {
    startDate: Date;
    endDate: Date;
    totalDays : number;
    reason : string;
    status: leaveApplicationStatus;
}

export const leaveApplicationDetailType = {
    startDate: { type: Date },
    endDate: { type: Date },
    totalDays: { type: Number },
    reason: { type: String },
    status: { type: String, enum: Object.values(leaveApplicationStatus),default:leaveApplicationStatus.Pending },
};