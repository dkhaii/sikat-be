import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { EmployeeLog } from './entities/employee-log.entity';
import { EmployeeLogDto } from './dto/employee-log.dto';

@Injectable()
export class EmployeeLogRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(emp: EmployeeLog): Promise<EmployeeLogDto> {
    const createdLog = await this.prismaService.employeeLog.create({
      data: emp,
    });

    return createdLog;
  }
}
