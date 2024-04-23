import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
import { WebResponse } from '../dto/web.dto';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('/api/auth/employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async addNew(
    @Body() dto: AddNewEmployeeDto,
  ): Promise<WebResponse<AddNewEmployeeDto>> {
    const employee = await this.employeeService.addNew(dto);

    const response: WebResponse<AddNewEmployeeDto> = {
      message: 'success add new employee',
      data: employee,
    };

    return response;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async showAll(): Promise<WebResponse<EmployeeDto[]>> {
    const employees = await this.employeeService.showALl();

    const response: WebResponse<EmployeeDto[]> = {
      message: 'success show all employees',
      data: employees,
    };

    return response;
  }

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  async findOneByID(
    @Param('id') id: string,
  ): Promise<WebResponse<EmployeeDto>> {
    const employee = await this.employeeService.findOneByID(id);

    const response: WebResponse<EmployeeDto> = {
      message: 'success find employee',
      data: employee,
    };

    return response;
  }

  @Get('/find')
  @HttpCode(HttpStatus.OK)
  async findByName(
    @Query('name') name: string,
  ): Promise<WebResponse<EmployeeDto[]>> {
    const employees = await this.employeeService.findByName(name);

    const response: WebResponse<EmployeeDto[]> = {
      message: 'success find employee',
      data: employees,
    };

    return response;
  }

  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<WebResponse<EmployeeDto>> {
    const updatedEmployee = await this.employeeService.update(id, dto);

    const response: WebResponse<EmployeeDto> = {
      message: `success update employee ${updatedEmployee.id}`,
      data: updatedEmployee,
    };

    return response;
  }

  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<WebResponse<void>> {
    await this.employeeService.delete(id);

    const response: WebResponse<void> = {
      message: `success delete user ${id}`,
    };

    return response;
  }
}
