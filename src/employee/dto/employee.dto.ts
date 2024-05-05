import { PartialType } from '@nestjs/mapped-types';
import { Employee } from '../entities/employee.entity';

export class EmployeeDto extends PartialType(Employee) {
  dateOfBirthStr: string;
  dateOfHireStr: string;
  positionName: string;
  crewName: string;
  pitName: string;
  baseName: string;
  isArchived: boolean;
  createdAtStr: string;
  updatedAtStr: string;
}
