import { leaveApplicationStatus } from "../../common/enums/leave-status.enum";

export interface assignment {
    facultyId: String;
    title: String;
    description : String;
    status ?: String;
}

export const assignmentDetailType = {
    facultyId: { type: String },
    title: { type: String },
    description: { type: String },
    status: { type: String ,default : ''},
};

export enum AssignmentStatus {
    OPEN = 'open',
    CLOSED = 'closed'
  }