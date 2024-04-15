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

@Controller('/api/auth/users')
export class UserController {
  // dependency injection
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async addNew(@Body() dto: AddNewUserDto): Promise<WebResponse<UserDto>> {
    const newUser = await this.userService.addNew(dto);

    const response: WebResponse<UserDto> = {
      message: 'success add new user',
      data: newUser,
    };

    return response;
  }

  @Delete('/:userID')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('userID') userID: string): Promise<WebResponse<string>> {
    await this.userService.delete(userID);

    const response: WebResponse<string> = {
      message: 'success delete user',
    };

    return response;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async showAll(): Promise<WebResponse<UserDto[]>> {
    const users = await this.userService.showAll();

    const response: WebResponse<UserDto[]> = {
      message: 'success showing all users',
      data: users,
    };

    return response;
  }
}
