import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserValidation } from './user.validation';
import { UserRepository } from './user.repository';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { AddNewUserDto } from './dto/add-new-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private userRepository: UserRepository,
  ) {}

  async addNew(dto: AddNewUserDto): Promise<UserDto> {
    // show logging when running the function
    this.logger.debug(`UserService.addNew ${JSON.stringify(dto)}`);

    // validate request body
    const addNewUserDto: AddNewUserDto = this.validationService.validate(
      UserValidation.ADDNEW,
      dto,
    );

    // check user existance
    const existingUser = await this.userRepository.findByBadgeNum(
      addNewUserDto.id,
    );
    if (existingUser) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    // hashing password
    addNewUserDto.password = await bcrypt.hash(addNewUserDto.password, 10);
    // add new user
    const user = await this.userRepository.insert(addNewUserDto);

    const userDto: UserDto = {
      id: user.id,
      name: user.name,
      roleID: user.roleID,
    };

    return userDto;
  }

  async delete(usrBadgeNum: string): Promise<void> {
    this.logger.debug(`UserService.delete ${JSON.stringify(usrBadgeNum)}`);

    // check user existance
    const existingUser = await this.userRepository.findByBadgeNum(usrBadgeNum);
    if (!existingUser) {
      throw new HttpException('No user exist', HttpStatus.NOT_FOUND);
    }

    await this.userRepository.delete(usrBadgeNum);
  }

  async findByBagdeNum(badgeNumber: string): Promise<UserDto> {
    this.logger.debug(
      `UserService.findByBadgeNum ${JSON.stringify(badgeNumber)}`,
    );

    const user = await this.userRepository.findByBadgeNum(badgeNumber);
    if (!user) {
      throw new HttpException('Badge Number Invalid', HttpStatus.BAD_REQUEST);
    }

    const userDto: UserDto = {
      id: user.id,
      password: user.password,
      name: user.name,
      roleID: user.roleID,
    };

    return userDto;
  }

  async showAll(): Promise<UserDto[]> {
    this.logger.debug('UserService.showAll');

    const users = await this.userRepository.findAll();

    return users;
  }
}
