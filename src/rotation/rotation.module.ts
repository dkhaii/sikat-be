import { forwardRef, Module } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RotationRepository } from './rotation.repository';
import { RotationController } from './rotation.controller';
import { EmployeeModule } from '../employee/employee.module';
import { RotationScheduledTaskService } from './rotation.scheduled-task.service';
import { EmployeeLogModule } from '../employee-log/employee-log.module';

@Module({
  imports: [forwardRef(() => EmployeeModule), EmployeeLogModule],
  controllers: [RotationController],
  providers: [
    RotationService,
    RotationRepository,
    RotationScheduledTaskService,
  ],
  exports: [RotationService],
})
export class RotationModule {}
