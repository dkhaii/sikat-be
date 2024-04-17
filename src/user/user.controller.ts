import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../dto/web.dto';
import { AddNewUserDto } from './dto/add-new-user.dto';
import { UserDto } from './dto/user.dto';
// import { Roles } from '../common/role/role.decorator';
// import { Role } from '../common/role/role.enum';

@Controller('/api/auth/users')
export class UserController {
  // dependency injection
  constructor(private userService: UserService) {}

  // @Roles(Role.SUPERINTENDENT)
  @Post()
  @HttpCode(HttpStatus.OK)
  // @Roles(UserRole.SUPERINTENDENT)
  async addNew(@Body() dto: AddNewUserDto): Promise<WebResponse<UserDto>> {
    // creating new user
    const newUser = await this.userService.addNew(dto);

    // JSON Response
    const response: WebResponse<UserDto> = {
      message: 'success add new user',
      data: newUser,
    };

    return response;
  }

  @Delete('/:userID')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('userID') userID: string): Promise<WebResponse<string>> {
    // deleting user
    await this.userService.delete(userID);

    // JSON Response
    const response: WebResponse<string> = {
      message: 'success delete user',
    };

    return response;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async showAll(): Promise<WebResponse<UserDto[]>> {
    // showing all user
    const users = await this.userService.showAll();

    // JSON response
    const response: WebResponse<UserDto[]> = {
      message: 'success showing all users',
      data: users,
    };

    return response;
  }
}
