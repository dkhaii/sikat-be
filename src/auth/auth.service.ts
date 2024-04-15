import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import {
  AccessTokenResponse,
  LoginRequest,
  UserResponse,
} from '../dto/user.dto';
import { UserValidation } from '../user/user.validation';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(request: LoginRequest): Promise<AccessTokenResponse> {
    this.logger.debug(`AuthService.validateUser ${JSON.stringify(request)}`);

    const loginRequest: LoginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.userService.findByBagdeNum(request.id);

    await bcrypt.compare(loginRequest.password, user.password);

    const payload: UserResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.sign(payload);

    const dto: AccessTokenResponse = {
      token: accessToken,
    };

    return dto;
  }
}
