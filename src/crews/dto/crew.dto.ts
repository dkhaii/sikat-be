import { EmployeeDto } from 'src/employee/dto/employee.dto';

export class CrewDto {
  id: number;
  name: string;
  employees?: Partial<EmployeeDto>[];
}
