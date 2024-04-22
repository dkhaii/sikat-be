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
import { AddNewEmployeeDto } from './dto/add-new-employee.dto';
import { WebResponse } from '../dto/web.dto';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
// import { UpdateEmployeeDto } from './dto/update-employee.dto';

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
