import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { EmployeeLogRepository } from './employee-log.repository';
import { EmployeeLogDto } from './dto/employee-log.dto';
import { CreateEmployeeLogDto } from './dto/create-employee-log.dto';

@Injectable()
export class EmployeeLogService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private employeeLogRepository: EmployeeLogRepository,
  ) {}

  async create(dto: CreateEmployeeLogDto): Promise<EmployeeLogDto> {
    this.logger.info(`EmployeeLogService.create ${JSON.stringify(dto)}`);

    const createdEmployeeLog = await this.employeeLogRepository.insert(dto);

    return createdEmployeeLog;
  }
}
