import { PartialType } from '@nestjs/mapped-types';
import { CreateLeavePlanDto } from './create-leave-plan.dto';
// import { LeavePlan } from '../entities/leave-plan.entity';

// export class UpdateLeavePlanDto extends PartialType(
//   OmitType(LeavePlan, ['employeeID', 'createdAt']),
// ) {
//   startDateStr?: string;
//   endDateStr?: string;
//   leaveStatusIDStr?: string;
// }

export class UpdateLeavePlanDto extends PartialType(CreateLeavePlanDto) {}
