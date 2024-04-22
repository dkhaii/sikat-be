import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: Employee): Promise<Employee> {
    const employee = await this.prismaService.employees.create({
      data: emp,
    });

    return employee;
  }

  async findOneByID(empID: string): Promise<Employee> {
    const employee = await this.prismaService.employees.findUnique({
      where: {
        id: empID,
      },
    });

    return employee;
  }
}
