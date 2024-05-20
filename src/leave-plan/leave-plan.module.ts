import { Module } from '@nestjs/common';
import { LeavePlanService } from './leave-plan.service';
import { LeavePlanController } from './leave-plan.controller';
import { LeavePlanRepository } from './leave-plan.repository';

@Module({
  controllers: [LeavePlanController],
  providers: [LeavePlanService, LeavePlanRepository],
})
export class LeavePlanModule {}
