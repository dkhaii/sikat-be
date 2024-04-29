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
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
import { WebResponse } from '../dto/web.dto';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateRotationDto } from '../rotation/dto/create-rotation.dto';
import { RotationDto } from '../rotation/dto/rotation.dto';
import { RotationService } from '../rotation/rotation.service';
import { UpdateRotationDto } from '../rotation/dto/update-rotation.dto';

@Controller('/api/auth/employees')
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    private readonly rotationService: RotationService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async addNew(
    @Body('empDto') empDto: AddNewEmployeeDto,
    @Body('rtnDto') rtnDto: CreateRotationDto,
  ): Promise<WebResponse<{ employee: EmployeeDto; rotation: RotationDto }>> {
    const [createdEmployee, createdRotation] =
      await this.employeeService.addNew(empDto, rtnDto);

    const response: WebResponse<{
      employee: EmployeeDto;
      rotation: RotationDto;
    }> = {
      message: 'success add new employee',
      data: {
        employee: createdEmployee,
        rotation: createdRotation,
      },
    };

    return response;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async showAll(): Promise<WebResponse<{ employee: EmployeeDto[] }>> {
    const employeeDtos = await this.employeeService.showALl();

    const response: WebResponse<{ employee: EmployeeDto[] }> = {
      message: 'success show all employees',
      data: {
        employee: employeeDtos,
      },
    };

    console.log(response);

    return response;
  }

  @Get('/find/:id')
  @HttpCode(HttpStatus.OK)
  async findOneByID(
    @Param('id') id: string,
  ): Promise<WebResponse<{ employee: EmployeeDto }>> {
    const employeeDto = await this.employeeService.findOneByID(id);

    const response: WebResponse<{ employee: EmployeeDto }> = {
      message: 'success find employee',
      data: {
        employee: employeeDto,
      },
    };

    return response;
  }

  @Get('/find')
  @HttpCode(HttpStatus.OK)
  async findByName(
    @Query('name') name: string,
  ): Promise<WebResponse<{ employee: EmployeeDto[] }>> {
    const employeeDtos = await this.employeeService.findByName(name);

    const response: WebResponse<{ employee: EmployeeDto[] }> = {
      message: 'success find employee',
      data: {
        employee: employeeDtos,
      },
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
  ): Promise<WebResponse<{ employee: EmployeeDto }>> {
    const updatedEmployeeDto = await this.employeeService.updateProfile(
      id,
      dto,
    );

    const response: WebResponse<{ employee: EmployeeDto }> = {
      message: `success update employee ${updatedEmployeeDto.id}`,
      data: {
        employee: updatedEmployeeDto,
      },
    };

    return response;
  }

  @Post('/rotation/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async setRotation(
    @Param('id') id: string,
    @Body() dto: UpdateRotationDto,
  ): Promise<WebResponse<{ rotation: RotationDto }>> {
    const rotationDto = await this.rotationService.create(id, dto);

    const response: WebResponse<{ rotation: RotationDto }> = {
      message: 'success create rotation',
      data: {
        rotation: rotationDto,
      },
    };

    return response;
  }
}
