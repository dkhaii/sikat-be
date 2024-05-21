import { Employee } from 'src/employee/entities/employee.entity';

export class Crew {
  id: number;
  name: string;
  employees?: Employee[];
}
