import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { WebResponse } from '../dto/web.dto';
import { RotationDto } from './dto/rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';
import { EmployeeDto } from 'src/employee/dto/employee.dto';
import { RotationScheduledTaskService } from './rotation.scheduled-task.service';
import { EmployeeLogDto } from 'src/employee-log/dto/employee-log.dto';

@Controller('/api/auth/rotation')
export class RotationController {
  constructor(
    private rotationService: RotationService,
    private rotationScheduledTaskService: RotationScheduledTaskService,
  ) {}

  @Post('/set/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('id') id: string,
    @Body() dto: UpdateRotationDto,
  ): Promise<WebResponse<{ rotation: RotationDto }>> {
    const rtnDatas = await this.rotationService.create(id, dto);

    const response: WebResponse<{ rotation: RotationDto }> = {
      message: 'success create rotation',
      data: {
        rotation: rtnDatas,
      },
    };

    return response;
  }

  @Patch('/check/end-date')
  @HttpCode(HttpStatus.OK)
  async checkArchiveEndDate(): Promise<
    WebResponse<{ employees: EmployeeDto[] }>
  > {
    const empDatas =
      await this.rotationScheduledTaskService.checkArchiveEndDate();

    const response: WebResponse<{ employees: EmployeeDto[] }> = {
      message: 'success',
      data: {
        employees: empDatas,
      },
    };

    return response;
  }

  @Patch('/check/effective-date')
  @HttpCode(HttpStatus.OK)
  async checkRotationAndUpdateEmployee(): Promise<
    WebResponse<{ employees: EmployeeDto[]; employeeLogs: EmployeeLogDto[] }>
  > {
    const [empDatas, empLogDatas] =
      await this.rotationScheduledTaskService.checkEffectiveDateAndUpdateEmployee();

    const response: WebResponse<{
      employees: EmployeeDto[];
      employeeLogs: EmployeeLogDto[];
    }> = {
      message: 'success',
      data: {
        employees: empDatas,
        employeeLogs: empLogDatas,
      },
    };

    return response;
  }
}
