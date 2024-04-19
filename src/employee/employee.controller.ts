import {
  Controller,
  // Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { WebResponse } from '../dto/web.dto';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('/api/auth/employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateEmployeeDto,
  ): Promise<WebResponse<CreateEmployeeDto>> {
    const newEmployee = await this.employeeService.create(dto);

    const response: WebResponse<CreateEmployeeDto> = {
      message: 'Success create new employee',
      data: newEmployee,
    };

    return response;
  }

  // @Get()
  // findAll() {
  //   return this.employeeService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.employeeService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
  //   return this.employeeService.update(+id, updateEmployeeDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.employeeService.remove(+id);
  // }
}
