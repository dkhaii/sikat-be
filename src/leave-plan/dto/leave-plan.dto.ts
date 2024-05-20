import { PartialType } from '@nestjs/mapped-types';
import { LeavePlan } from '../entities/leave-plan.entity';

export class LeavePlanDto extends PartialType(LeavePlan) {
  startDateStr: string;
  endDateStr: string;
  leaveStatusName: string;
  createdAtStr: string;
  updatedAtStr: string;
}
