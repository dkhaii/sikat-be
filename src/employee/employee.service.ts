import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EmployeeRepository } from './epmloyee.repository';
import { ValidationService } from '../common/validation.service';
import { EmployeeValidation } from './employee.validation';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private employeeRepository: EmployeeRepository,
  ) {}

  async addNew(dto: AddNewEmployeeDto): Promise<AddNewEmployeeDto> {
    this.logger.info(`EmployeeService.create ${JSON.stringify(dto)}`);

    const validatedEmployeDto = await this.validationService.validate(
      EmployeeValidation.ADDNEW,
      dto,
    );

    const isEmployeeExist = await this.employeeRepository.findOneByID(
      validatedEmployeDto.id,
    );
    if (isEmployeeExist) {
      throw new HttpException('Employee already exist', HttpStatus.BAD_REQUEST);
    }

    const employee = await this.employeeRepository.insert(validatedEmployeDto);

    return employee;
  }

  // findAll() {
  //   return `This action returns all employee`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} employee`;
  // }

  // update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
  //   return `This action updates a #${id} employee`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} employee`;
  // }
}
