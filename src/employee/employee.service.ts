import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EmployeeRepository } from './employee.repository';
import { ValidationService } from '../common/validation.service';
import { EmployeeValidation } from './employee.validation';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private employeeRepository: EmployeeRepository,
    private validationService: ValidationService,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<CreateEmployeeDto> {
    this.logger.info(`EmployeeService.create ${JSON.stringify(dto)}`);

    const createEmployeeDto: CreateEmployeeDto =
      this.validationService.validate(EmployeeValidation.CREATE_EMPLOYEE, dto);

    const existingUser = await this.employeeRepository.findByBadgeNumber(
      createEmployeeDto.id,
    );
    if (existingUser) {
      throw new HttpException('Employee already exist', HttpStatus.BAD_REQUEST);
    }

    const employee = await this.employeeRepository.insert(createEmployeeDto);
    const createdAt = new Date();
    const updatedAt = createdAt;

    const newEmployeeDto: CreateEmployeeDto = {
      id: employee.id,
      name: employee.name,
      profilePicture: employee.profilePicture,
      dateOfBirth: employee.dateOfBirth,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };

    return newEmployeeDto;
  }
}
