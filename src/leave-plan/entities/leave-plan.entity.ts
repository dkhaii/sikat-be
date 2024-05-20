import { LeaveStatus } from '@prisma/client';

export class LeavePlan {
  employeeID: string;
  startDate: Date;
  endDate: Date;
  leaveStatusID: number;
  isApproved?: boolean;
  formCuti?: string;
  createdAt: Date;
  updatedAt: Date;
  leaveStatus?: LeaveStatus;
}
