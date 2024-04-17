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
import { Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { Public } from '../common/public-routes.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';

@Controller('/api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<WebResponse<AccessTokenDto>> {
    // login user account
    const usrAccessToken = await this.authService.login(dto);

    // JSON response
    const response: WebResponse<AccessTokenDto> = {
      message: 'Login Success',
      data: usrAccessToken,
    };

    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() request: Request): Promise<WebResponse<any>> {
    // JSON response getting authenticated user profile
    const dto: WebResponse<any> = {
      message: 'get user profile',
      data: request.user,
    };

    return dto;
  }
}
