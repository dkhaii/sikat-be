import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { EmployeeRepository } from './employee.repository';
import { RotationModule } from '../rotation/rotation.module';

@Module({
  imports: [RotationModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
