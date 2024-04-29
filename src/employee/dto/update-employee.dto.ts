import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Employee } from '../entities/employee.entity';

export class UpdateEmployeeDto extends PartialType(
  OmitType(Employee, ['id', 'createdAt']),
) {}
