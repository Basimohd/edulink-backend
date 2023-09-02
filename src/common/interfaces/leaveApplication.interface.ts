import { CommonStatus } from "../../common/enums/leave-status.enum";

export interface leaveApplication {
    startDate: Date;
    endDate: Date;
    totalDays : number;
    reason : string;
    status: CommonStatus;
}

export const leaveApplicationDetailType = {
    startDate: { type: Date },
    endDate: { type: Date },
    totalDays: { type: Number },
    reason: { type: String },
    status: { type: String, enum: Object.values(CommonStatus),default:CommonStatus.Pending },
};