import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EmployeeRepository } from './employee.repository';
import { ValidationService } from '../common/validation.service';
import { EmployeeValidation } from './employee.validation';
import { EmployeeDto } from './dto/employee.dto';
import { Employee } from './entities/employee.entity';
import { CreateRotationDto } from '../rotation/dto/create-rotation.dto';
import { RotationService } from '../rotation/rotation.service';
import { RotationDto } from '../rotation/dto/rotation.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private employeeRepository: EmployeeRepository,
    private rotationService: RotationService,
  ) {}

  async addNew(
    empDto: AddNewEmployeeDto,
    rtnDto: CreateRotationDto,
  ): Promise<[EmployeeDto, RotationDto]> {
    this.logger.info(
      `EmployeeService.create empDto: ${JSON.stringify(empDto)}`,
    );
    this.logger.info(
      `EmployeeService.create rtnDto: ${JSON.stringify(rtnDto)}`,
    );

    const validatedEmployeDto: AddNewEmployeeDto =
      this.validationService.validate(EmployeeValidation.ADDNEW, empDto);

    const isExist = await this.employeeRepository.countSameID(
      validatedEmployeDto.id,
    );
    if (isExist != 0) {
      throw new HttpException('employee already exist', HttpStatus.BAD_REQUEST);
    }

    const createdAt = new Date();
    const isArchived = true;
    const employee: Employee = {
      id: validatedEmployeDto.id,
      name: validatedEmployeDto.name,
      profilePicture: validatedEmployeDto.profilePicture,
      dateOfBirth: validatedEmployeDto.dateOfBirth,
      dateOfHire: validatedEmployeDto.dateOfHire,
      positionID: validatedEmployeDto.positionID,
      crewID: validatedEmployeDto.crewID,
      pitID: validatedEmployeDto.pitID,
      baseID: validatedEmployeDto.baseID,
      isArchived: isArchived,
      createdAt: createdAt,
      updatedAt: createdAt,
    };

    const createdEmployee = await this.employeeRepository.insert(employee);
    let createdRotation: RotationDto;
    if (createdEmployee) {
      createdRotation = await this.rotationService.setEffectiveDate(
        validatedEmployeDto.id,
        rtnDto,
      );
    }

    return [createdEmployee, createdRotation];
  }

  async showALl(): Promise<EmployeeDto[]> {
    this.logger.info(`EmployeeService.showAll`);

    const employees = await this.employeeRepository.showAll();
    if (employees.length == 0) {
      throw new HttpException('No records', HttpStatus.NOT_FOUND);
    }

    return employees;
  }

  async findOneByID(empID: string): Promise<EmployeeDto> {
    this.logger.info(`EmployeeService.findOneByID ${JSON.stringify(empID)}`);

    const employee = await this.employeeRepository.findOneByID(empID);
    if (employee == null) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async findByName(empName: string): Promise<EmployeeDto[]> {
    this.logger.info(`EmployeeService.findByName ${JSON.stringify(empName)}`);
    console.log(empName);

    const employees = await this.employeeRepository.findByName(empName);
    if (employees.length === 0) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    return employees;
  }

  async updateProfile(
    empID: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeDto> {
    this.logger.info(
      `EmployeeService.update ${JSON.stringify(updateEmployeeDto)}`,
    );

    const validatedUpdateEmployeeDto: UpdateEmployeeDto =
      await this.validationService.validate(
        EmployeeValidation.UPDATE,
        updateEmployeeDto,
      );

    const isExist = await this.employeeRepository.countSameID(empID);
    if (isExist == 0) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    const updatedAt = new Date();
    const employee: UpdateEmployeeDto = {
      name: validatedUpdateEmployeeDto.name,
      profilePicture: validatedUpdateEmployeeDto.profilePicture,
      dateOfBirth: validatedUpdateEmployeeDto.dateOfBirth,
      dateOfHire: validatedUpdateEmployeeDto.dateOfHire,
      updatedAt: updatedAt,
    };

    const updatedEmployee = await this.employeeRepository.update(
      empID,
      employee,
    );

    return updatedEmployee;
  }

  async archive(
    empID: string,
    rtnDto: CreateRotationDto,
  ): Promise<[RotationDto, EmployeeDto]> {
    this.logger.info(`EmployeeService.delete ${JSON.stringify(empID)}`);

    const employee = await this.employeeRepository.findOneByID(empID);
    if (employee == null) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    const endRotation = await this.rotationService.setEndDate(
      employee.id,
      rtnDto,
    );

    if (!endRotation) {
      throw new HttpException(
        'ini ada error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const archiveStatus: UpdateEmployeeDto = {
      isArchived: true,
    };

    const updatedEmployee = await this.employeeRepository.update(
      empID,
      archiveStatus,
    );

    return [endRotation, updatedEmployee];
  }

  @Cron('* * 17 * * *')
  async checkArchiveEndDate() {
    const rotations = await this.rotationService.showAll();
    const currentDate = new Date();

    for (const rotation of rotations) {
      if (rotation.endDate == currentDate) {
        const updateArchiveStatus: UpdateEmployeeDto = {
          isArchived: true,
        };
        await this.employeeRepository.update(
          rotation.employeeID,
          updateArchiveStatus,
        );
      }
    }
  }

  @Cron('* * 17 * * *')
  async checkAndUpdate() {
    const rotations = await this.rotationService.showAll();
    const currentDate = new Date();

    for (const rotation of rotations) {
      if (rotation.effectiveDate == currentDate) {
        const updateEmployee: UpdateEmployeeDto = {
          positionID: rotation.positionID,
          crewID: rotation.crewID,
          pitID: rotation.pitID,
          baseID: rotation.baseID,
        };

        if (updateEmployee) {
          await this.employeeRepository.update(
            rotation.employeeID,
            updateEmployee,
          );
        }

        const updateArchiveStatus: UpdateEmployeeDto = {
          isArchived: false,
        };
        await this.employeeRepository.update(
          rotation.employeeID,
          updateArchiveStatus,
        );
      }
    }
  }
}
