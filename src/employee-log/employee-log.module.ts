import { Module } from '@nestjs/common';
import { EmployeeLogRepository } from './employee-log.repository';
import { EmployeeLogService } from './employee-log.service';

@Module({
  providers: [EmployeeLogRepository, EmployeeLogService],
  exports: [EmployeeLogService],
})
export class EmployeeLogModule {}
