import { PartialType } from '@nestjs/mapped-types';
import { AddNewEmployeeDto } from './add-new-employee.dto';

export class UpdateEmployeeDto extends PartialType(AddNewEmployeeDto) {}
