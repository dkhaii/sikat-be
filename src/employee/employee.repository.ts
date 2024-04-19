import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: Employee): Promise<Employee> {
    //inserting new employee
    const employee = await this.prismaService.employees.create({
      data: emp,
    });

    return employee;
  }

  async findAll(): Promise<Employee[]> {
    const employees = await this.prismaService.employees.findMany();

    return employees;
  }

  async findByBadgeNumber(badgeNumber: string): Promise<Employee> {
    const employee = await this.prismaService.employees.findFirst({
      where: {
        id: badgeNumber,
      },
    });

    return employee;
  }
}
