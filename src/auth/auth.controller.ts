import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WebResponse } from '../dto/web.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<WebResponse<AccessTokenDto>> {
    const usrAccessToken = await this.authService.login(dto);

    const response: WebResponse<AccessTokenDto> = {
      message: 'Login Success',
      data: usrAccessToken,
    };

    return response;
  }

  @Get('profile')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() request: Request): Promise<WebResponse<any>> {
    const dto: WebResponse<any> = {
      message: 'get user profile',
      data: request.user,
    };

    return dto;
  }
}
