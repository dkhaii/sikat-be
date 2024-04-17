import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from '../common/validation.service';
import { UserValidation } from '../user/user.validation';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  // dependency injection
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async validateUser(dto: LoginDto): Promise<UserDto> {
    // logger
    this.logger.debug(`AuthService.validateUser ${JSON.stringify(dto)}`);

    // find user by badge number to validate user
    const user = await this.userService.findByBagdeNum(dto.id);
    if (!user) {
      // throw an error
      throw new HttpException('Invalid Badge Number', HttpStatus.BAD_REQUEST);
    }

    // validating user password with DTO to see if match
    const isPassword = await bcrypt.compareSync(dto.password, user.password);
    if (!isPassword) {
      // throw an error
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async login(dto: LoginDto): Promise<AccessTokenDto> {
    // logger
    this.logger.debug(`AuthService.login ${JSON.stringify(dto)}`);

    // validating login body payload
    const loginDto: LoginDto = this.validationService.validate(
      UserValidation.LOGIN,
      dto,
    );

    // validating user
    const user = await this.validateUser(loginDto);

    // creating payload for jwt credentials
    const payload: UserDto = {
      id: user.id,
      name: user.name,
      roleID: user.roleID,
    };

    // signing payload to jwt credentials and creating access token
    const accessToken = await this.jwtService.signAsync(payload);

    // DTO
    const accessTokenDto: AccessTokenDto = {
      token: accessToken,
    };

    return accessTokenDto;
  }
}
