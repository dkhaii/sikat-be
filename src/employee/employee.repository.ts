import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Employee } from './entities/employee.entity';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: Employee): Promise<EmployeeDto> {
    const employee = await this.prismaService.employees.create({
      data: {
        id: emp.id,
        name: emp.name,
        profilePicture: emp.profilePicture,
        dateOfBirth: emp.dateOfBirth,
        dateOfHire: emp.dateOfHire,
        positionID: emp.positionID,
        crewID: emp.crewID,
        pitID: emp.pitID,
        baseID: emp.baseID,
        createdAt: emp.createdAt,
        updatedAt: emp.updatedAt,
      },
      include: {
        position: true,
        crew: true,
        pit: true,
        base: true,
      },
    });

    const employeeDto = await this.mapEntityToDto(employee);

    return employeeDto;
  }

  async showAll(): Promise<EmployeeDto[]> {
    const employees = await this.prismaService.employees.findMany({
      where: {
        isArchived: false,
      },
      include: {
        position: true,
        crew: true,
        pit: true,
        base: true,
      },
    });

    const employeeDto: EmployeeDto[] = await Promise.all(
      employees.map(async (emp) => await this.mapEntityToDto(emp)),
    );

    return employeeDto;
  }

  async findOneByID(empID: string): Promise<EmployeeDto | null> {
    const employee = await this.prismaService.employees.findUnique({
      where: {
        id: empID,
      },
      include: {
        position: true,
        crew: true,
        pit: true,
        base: true,
      },
    });
    if (employee && employee.isArchived == false) {
      const employeeDto = await this.mapEntityToDto(employee);

      return employeeDto;
    }

    return null;
  }

  async countSameID(empID: string): Promise<number> {
    const employeeIDs = await this.prismaService.employees.count({
      where: {
        id: empID,
      },
    });

    return employeeIDs;
  }

  async findByName(empName: string): Promise<EmployeeDto[]> {
    console.log('repository: ', empName);

    const employees = await this.prismaService.employees.findMany({
      where: {
        name: {
          contains: empName,
          mode: 'insensitive',
        },
        isArchived: {
          equals: false,
        },
      },
      include: {
        position: true,
        crew: true,
        pit: true,
        base: true,
      },
    });

    const employeeDto: EmployeeDto[] = await Promise.all(
      employees.map(async (emp) => await this.mapEntityToDto(emp)),
    );

    return employeeDto;
  }

  async update(empID: string, dto: UpdateEmployeeDto): Promise<EmployeeDto> {
    const employee = await this.prismaService.employees.update({
      where: {
        id: empID,
      },
      data: {
        name: dto.name,
        profilePicture: dto.profilePicture,
        dateOfBirth: dto.dateOfBirth,
        dateOfHire: dto.dateOfHire,
        positionID: dto.positionID,
        crewID: dto.crewID,
        pitID: dto.pitID,
        baseID: dto.baseID,
        updatedAt: dto.updatedAt,
      },
      include: {
        position: true,
        crew: true,
        pit: true,
        base: true,
      },
    });

    const employeeDto = await this.mapEntityToDto(employee);

    return employeeDto;
  }

  async delete(empID: string): Promise<void> {
    await this.prismaService.employees.delete({
      where: {
        id: empID,
      },
    });
  }

  private async mapEntityToDto(employee: Employee): Promise<EmployeeDto> {
    const employeeDto: EmployeeDto = {
      id: employee.id,
      name: employee.name,
      profilePicture: employee.profilePicture,
      dateOfBirth: employee.dateOfBirth,
      dateOfHire: employee.dateOfHire,
      position: employee.position.name,
      crew: employee.crew.name,
      pit: employee.pit.name,
      base: employee.base.name,
      isArchived: employee.isArchived,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };

    return employeeDto;
  }
}
