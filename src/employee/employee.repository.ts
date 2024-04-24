import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Employee } from './entities/employee.entity';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: Employee): Promise<EmployeeDto> {
    const employee = await this.prismaService.employees.create({
      data: emp,
      include: {
        position: {
          select: {
            name: true,
          },
        },
        crew: {
          select: {
            name: true,
          },
        },
        pit: {
          select: {
            name: true,
          },
        },
        base: {
          select: {
            name: true,
          },
        },
      },
    });

    const employeeDto = await this.mapEntityToEmployeeDto(employee);

    return employeeDto;
  }

  async showAll(): Promise<EmployeeDto[]> {
    const employees = await this.prismaService.employees.findMany({
      include: {
        position: {
          select: {
            name: true,
          },
        },
        crew: {
          select: {
            name: true,
          },
        },
        pit: {
          select: {
            name: true,
          },
        },
        base: {
          select: {
            name: true,
          },
        },
      },
    });

    const employeeDto: EmployeeDto[] = await Promise.all(
      employees.map(async (emp) => await this.mapEntityToEmployeeDto(emp)),
    );

    return employeeDto;
  }

  async findOneByID(empID: string): Promise<EmployeeDto | null> {
    const employee = await this.prismaService.employees.findUnique({
      where: {
        id: empID,
      },
      include: {
        position: {
          select: {
            name: true,
          },
        },
        crew: {
          select: {
            name: true,
          },
        },
        pit: {
          select: {
            name: true,
          },
        },
        base: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!employee) {
      return null;
    }

    const employeeDto = await this.mapEntityToEmployeeDto(employee);

    return employeeDto;
  }

  async findByName(empName: string): Promise<EmployeeDto[]> {
    const employees = await this.prismaService.employees.findMany({
      where: {
        name: {
          contains: empName,
        },
      },
      include: {
        position: {
          select: {
            name: true,
          },
        },
        crew: {
          select: {
            name: true,
          },
        },
        pit: {
          select: {
            name: true,
          },
        },
        base: {
          select: {
            name: true,
          },
        },
      },
    });

    const employeeDto: EmployeeDto[] = await Promise.all(
      employees.map(async (emp) => await this.mapEntityToEmployeeDto(emp)),
    );

    return employeeDto;
  }

  async update(
    empID: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeDto> {
    const employee = await this.prismaService.employees.update({
      where: {
        id: empID,
      },
      data: updateEmployeeDto,
      include: {
        position: {
          select: {
            name: true,
          },
        },
        crew: {
          select: {
            name: true,
          },
        },
        pit: {
          select: {
            name: true,
          },
        },
        base: {
          select: {
            name: true,
          },
        },
      },
    });

    const employeeDto = await this.mapEntityToEmployeeDto(employee);

    return employeeDto;
  }

  async delete(empID: string): Promise<void> {
    await this.prismaService.employees.delete({
      where: {
        id: empID,
      },
    });
  }

  private async mapEntityToEmployeeDto(employee: any): Promise<EmployeeDto> {
    const employeeDto: EmployeeDto = {
      id: employee.id,
      name: employee.name,
      profilePicture: employee.profilePicture,
      dateOfBirth: employee.dateOfBirth,
      position: employee.position.name,
      crew: employee.crew.name,
      pit: employee.pit.name,
      base: employee.base.name,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return employeeDto;
  }
}
