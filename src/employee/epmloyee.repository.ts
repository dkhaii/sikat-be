import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: Employee): Promise<Employee> {
    const employee = await this.prismaService.employees.create({
      data: emp,
    });

    return employee;
  }

  async showAll(): Promise<Employee[]> {
    const employees = await this.prismaService.employees.findMany();

    return employees;
  }

  async findOneByID(empID: string): Promise<Employee> {
    const employee = await this.prismaService.employees.findUnique({
      where: {
        id: empID,
      },
    });

    return employee;
  }

  async findByName(empName: string): Promise<Employee[]> {
    const employees = await this.prismaService.employees.findMany({
      where: {
        name: {
          contains: empName,
        },
      },
    });

    return employees;
  }

  async update(
    empID: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.prismaService.employees.update({
      where: {
        id: empID,
      },
      data: updateEmployeeDto,
    });

    return employee;
  }

  async delete(empID: string): Promise<void> {
    await this.prismaService.employees.delete({
      where: {
        id: empID,
      },
    });
  }
}
