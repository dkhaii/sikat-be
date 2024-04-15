import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import { UserValidation } from '../user/user.validation';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(dto: LoginDto): Promise<AccessTokenDto> {
    this.logger.debug(`AuthService.validateUser ${JSON.stringify(dto)}`);

    const loginRequest: LoginDto = this.validationService.validate(
      UserValidation.LOGIN,
      dto,
    );

    const user = await this.userService.findByBagdeNum(dto.id);

    await bcrypt.compare(loginRequest.password, user.password);

    const payload: UserDto = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.sign(payload);

    const accessTokenDto: AccessTokenDto = {
      token: accessToken,
    };

    return accessTokenDto;
  }
}
