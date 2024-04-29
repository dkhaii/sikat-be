import { OmitType } from '@nestjs/mapped-types';
import { Employee } from '../entities/employee.entity';

export class AddNewEmployeeDto extends OmitType(Employee, [
  'isArchived',
  'createdAt',
  'updatedAt',
]) {}
