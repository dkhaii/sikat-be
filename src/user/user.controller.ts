import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AddNewUserRequest, UserResponse } from '../dto/user.dto';
import { WebResponse } from '../dto/web.dto';

@Controller('/api/auth/users')
export class UserController {
  // dependency injection
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async addNew(
    @Body() request: AddNewUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const newUser = await this.userService.addNew(request);

    const response: WebResponse<UserResponse> = {
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
}
