import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '../src/user/entities/user.entity';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AuthService } from '../src/auth/auth.service';
import { Employee } from '../src/employee/entities/employee.entity';
import { Positions } from '../src/employee/enums/position.enum';
import { Crews } from '../src/employee/enums/crew.enum';
import { Pits } from '../src/employee/enums/pit.enum';
import { Bases } from '../src/employee/enums/base.enum';
import { Rotation } from '../src/rotation/entities/rotation.entity';
import { v4 as uuid } from 'uuid';
import { faker } from '@faker-js/faker';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private authServie: AuthService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const loginResponse = await this.authServie.login(loginDto);

    return loginResponse;
  }

  async deleteUser() {
    const userOne = await this.findUser('zs8565');
    if (userOne) {
      await this.prismaService.users.delete({
        where: {
          id: 'zs8565',
        },
      });
    }

    const userTwo = await this.findUser('zs8566');
    if (userTwo) {
      await this.prismaService.users.delete({
        where: {
          id: 'zs8566',
        },
      });
    }
  }

  async createSuptUser() {
    await this.prismaService.users.create({
      data: {
        id: 'zs8565',
        password: await bcrypt.hash('zs8565', 10),
        name: 'Supt. User',
        roleID: 1,
      },
    });
  }

  async createSupvUser() {
    await this.prismaService.users.create({
      data: {
        id: 'zs8566',
        password: await bcrypt.hash('zs8566', 10),
        name: 'Supv. User',
        roleID: 2,
      },
    });
  }

  async findUser(usrBadgeNum: string): Promise<User> {
    const user: User = await this.prismaService.users.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }

  async createEmployee() {
    const employee = await this.prismaService.employees.create({
      data: {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (employee) {
      await this.prismaService.rotation.create({
        data: {
          employeeID: 'zs8565',
          effectiveDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return employee;
  }

  async createEmployeeWithFalseArchived() {
    const employee = await this.prismaService.employees.create({
      data: {
        id: '99999',
        name: 'Mordekhai',
        profilePicture: 'gerin',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    if (employee) {
      await this.prismaService.rotation.create({
        data: {
          employeeID: '99999',
          effectiveDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  async createEmployeeWithEndDate(date: string) {
    const amountOfEmployees = 2;

    const employees: Employee[] = [];

    for (let i = 0; i < amountOfEmployees; i++) {
      const employee: Employee = {
        id: uuid(),
        name: faker.person.fullName(),
        profilePicture: uuid(),
        dateOfBirth: faker.date.birthdate(),
        dateOfHire: faker.date.past(),
        positionID: faker.helpers.enumValue(Positions),
        crewID: faker.helpers.enumValue(Crews),
        pitID: faker.helpers.enumValue(Pits),
        baseID: faker.helpers.enumValue(Bases),
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employees.push(employee);
    }
    console.log(employees);

    for (const employee of employees) {
      const createdEmployee = await this.prismaService.employees.create({
        data: {
          id: employee.id,
          name: employee.name,
          profilePicture: employee.profilePicture,
          dateOfBirth: employee.dateOfBirth,
          dateOfHire: employee.dateOfHire,
          positionID: employee.positionID,
          crewID: employee.crewID,
          pitID: employee.pitID,
          baseID: employee.baseID,
          isArchived: employee.isArchived,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        },
      });

      if (createdEmployee) {
        const rotation = await this.prismaService.rotation.create({
          data: {
            employeeID: createdEmployee.id,
            endDate: new Date(date),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });

        console.log(rotation);
      }
    }
  }

  async createEmployeeWithEffectiveDate(date: string) {
    const amountOfEmployees = 2;

    const employees: Employee[] = [];

    for (let i = 0; i < amountOfEmployees; i++) {
      const employee: Employee = {
        id: uuid(),
        name: faker.person.fullName(),
        profilePicture: uuid(),
        dateOfBirth: faker.date.birthdate(),
        dateOfHire: faker.date.past(),
        positionID: faker.helpers.enumValue(Positions),
        crewID: faker.helpers.enumValue(Crews),
        pitID: faker.helpers.enumValue(Pits),
        baseID: faker.helpers.enumValue(Bases),
        isArchived: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employees.push(employee);
    }
    console.log(employees);

    for (const employee of employees) {
      const createdEmployee = await this.prismaService.employees.create({
        data: {
          id: employee.id,
          name: employee.name,
          profilePicture: employee.profilePicture,
          dateOfBirth: employee.dateOfBirth,
          dateOfHire: employee.dateOfHire,
          positionID: employee.positionID,
          crewID: employee.crewID,
          pitID: employee.pitID,
          baseID: employee.baseID,
          isArchived: employee.isArchived,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        },
      });

      if (createdEmployee) {
        await this.prismaService.rotation.create({
          data: {
            employeeID: createdEmployee.id,
            effectiveDate: new Date(date),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  async createEmployeeWithSettedRotation(date: string) {
    const amountOfEmployees = 2;

    const employees: Employee[] = [];

    for (let i = 0; i < amountOfEmployees; i++) {
      const employee: Employee = {
        id: uuid(),
        name: faker.person.fullName(),
        profilePicture: uuid(),
        dateOfBirth: faker.date.birthdate(),
        dateOfHire: faker.date.past(),
        positionID: faker.helpers.enumValue(Positions),
        crewID: faker.helpers.enumValue(Crews),
        pitID: faker.helpers.enumValue(Pits),
        baseID: faker.helpers.enumValue(Bases),
        isArchived: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      employees.push(employee);
    }
    console.log(employees);

    for (const employee of employees) {
      const createdEmployee = await this.prismaService.employees.create({
        data: {
          id: employee.id,
          name: employee.name,
          profilePicture: employee.profilePicture,
          dateOfBirth: employee.dateOfBirth,
          dateOfHire: employee.dateOfHire,
          positionID: employee.positionID,
          crewID: employee.crewID,
          pitID: employee.pitID,
          baseID: employee.baseID,
          isArchived: employee.isArchived,
          createdAt: employee.createdAt,
          updatedAt: employee.updatedAt,
        },
      });

      if (createdEmployee) {
        await this.prismaService.rotation.create({
          data: {
            employeeID: createdEmployee.id,
            effectiveDate: new Date(date),
            positionID: faker.helpers.enumValue(Positions),
            pitID: faker.helpers.enumValue(Pits),
            baseID: faker.helpers.enumValue(Bases),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  async createOneEmployeeWithSettedRotation() {
    const employee: Employee = {
      id: uuid(),
      name: faker.person.fullName(),
      profilePicture: uuid(),
      dateOfBirth: faker.date.birthdate(),
      dateOfHire: faker.date.past(),
      positionID: faker.helpers.enumValue(Positions),
      crewID: faker.helpers.enumValue(Crews),
      pitID: faker.helpers.enumValue(Pits),
      baseID: faker.helpers.enumValue(Bases),
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdEmployee = await this.prismaService.employees.create({
      data: {
        id: employee.id,
        name: employee.name,
        profilePicture: employee.profilePicture,
        dateOfBirth: employee.dateOfBirth,
        dateOfHire: employee.dateOfHire,
        positionID: employee.positionID,
        crewID: employee.crewID,
        pitID: employee.pitID,
        baseID: employee.baseID,
        isArchived: employee.isArchived,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      },
    });

    if (createdEmployee) {
      await this.prismaService.rotation.create({
        data: {
          employeeID: createdEmployee.id,
          effectiveDate: new Date(2024, 4, 5),
          positionID: faker.helpers.enumValue(Positions),
          pitID: faker.helpers.enumValue(Pits),
          baseID: faker.helpers.enumValue(Bases),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return employee;
  }

  async findOneEmployee(badgeNum: string): Promise<Employee> {
    const employee: Employee = await this.prismaService.employees.findUnique({
      where: {
        id: badgeNum,
      },
    });

    return employee;
  }

  async findOneRotation(badgeNum: string): Promise<Rotation> {
    const rotation: Rotation = await this.prismaService.rotation.findUnique({
      where: {
        employeeID: badgeNum,
      },
    });

    return rotation;
  }

  async deleteEmployee() {
    const employee = await this.findOneEmployee('zs8565');
    if (employee) {
      const rotation = await this.prismaService.rotation.findUnique({
        where: {
          employeeID: 'zs8565',
        },
      });
      if (rotation) {
        await this.prismaService.rotation.delete({
          where: {
            employeeID: 'zs8565',
          },
        });
      }

      await this.prismaService.employees.delete({
        where: {
          id: 'zs8565',
        },
      });
    }
  }

  async deleteEmployeeAndRotation(empID: string) {
    const employee = await this.findOneEmployee(empID);
    if (employee) {
      const rotation = await this.prismaService.rotation.findUnique({
        where: {
          employeeID: empID,
        },
      });
      if (rotation) {
        await this.prismaService.rotation.delete({
          where: {
            employeeID: empID,
          },
        });
      }

      await this.prismaService.employees.delete({
        where: {
          id: empID,
        },
      });
    }
  }

  async deleteEmployeeWithFalseArchived() {
    const employee = await this.findOneEmployee('99999');
    if (employee) {
      const rotation = await this.prismaService.rotation.findUnique({
        where: {
          employeeID: '99999',
        },
      });
      if (rotation) {
        await this.prismaService.rotation.delete({
          where: {
            employeeID: '99999',
          },
        });
      }

      await this.prismaService.employees.delete({
        where: {
          id: '99999',
        },
      });
    }
  }

  async deleteAllEmployee() {
    await this.prismaService.employees.deleteMany();
  }

  // async deleteRotation() {
  //   const rotation = await this.findOneRotation('zs8565');
  //   if (rotation) {
  //     await this.prismaService.rotation.delete({
  //       where: {
  //         employeeID: 'zs8565',
  //       },
  //     });
  //   }
  // }
}
