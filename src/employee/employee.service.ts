import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EmployeeRepository } from './employee.repository';
import { ValidationService } from '../common/validation.service';
import { EmployeeValidation } from './employee.validation';
import { EmployeeDto } from './dto/employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private employeeRepository: EmployeeRepository,
  ) {}

  async addNew(dto: AddNewEmployeeDto): Promise<EmployeeDto> {
    this.logger.info(`EmployeeService.create ${JSON.stringify(dto)}`);

    const validatedEmployeDto: AddNewEmployeeDto =
      this.validationService.validate(EmployeeValidation.ADDNEW, dto);

    const isExist = await this.employeeRepository.findOneByID(
      validatedEmployeDto.id,
    );
    if (isExist != null) {
      throw new HttpException('Employee already exist', HttpStatus.BAD_REQUEST);
    }

    const createdAt = new Date();
    validatedEmployeDto.createdAt = createdAt;
    validatedEmployeDto.updatedAt = createdAt;
    const employee = await this.employeeRepository.insert(validatedEmployeDto);

    return employee;
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
    this.logger.info(
      `EmployeeService.findOneCompleteByID ${JSON.stringify(empID)}`,
    );

    const employee = await this.employeeRepository.findOneByID(empID);
    if (employee == null) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    return employee;
  }

  async findByName(empName: string): Promise<EmployeeDto[]> {
    this.logger.info(
      `EmployeeService.findOneCompleteByID ${JSON.stringify(empName)}`,
    );

    const employees = await this.employeeRepository.findByName(empName);
    if (employees.length === 0) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    return employees;
  }

  async update(
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

    const isEmployeeExist = await this.findOneByID(empID);
    if (!isEmployeeExist) {
      throw new HttpException(`Employee not exist`, HttpStatus.NOT_FOUND);
    }

    validatedUpdateEmployeeDto.updatedAt = new Date();
    const employee = await this.employeeRepository.update(
      empID,
      validatedUpdateEmployeeDto,
    );

    return employee;
  }

  async delete(empID: string): Promise<void> {
    this.logger.info(`EmployeeService.delete ${JSON.stringify(empID)}`);

    const isEmployeeExist = await this.employeeRepository.findOneByID(empID);
    if (!isEmployeeExist) {
      throw new HttpException('Employee not exist', HttpStatus.NOT_FOUND);
    }

    await this.employeeRepository.delete(empID);
  }
}
