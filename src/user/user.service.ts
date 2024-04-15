import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UserValidation } from './user.validation';
import { UserRepository } from './user.repository';
import { ValidationService } from '../common/validation.service';
import { AddNewUserRequest, UserResponse } from '../dto/user.dto';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/model/user.model';
// import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private validationService: ValidationService,
    private userRepository: UserRepository,
  ) {}

  async addNew(request: AddNewUserRequest): Promise<UserResponse> {
    // show logging when running the function
    this.logger.debug(`UserService.addNew ${JSON.stringify(request)}`);

    // validate request body
    const addNewUserRequest: AddNewUserRequest =
      this.validationService.validate(UserValidation.ADDNEW, request);

    // check user existance
    const existingUser = await this.userRepository.findByBadgeNum(
      addNewUserRequest.id,
    );
    if (existingUser) {
      throw new HttpException('User already exist', HttpStatus.BAD_REQUEST);
    }

    // hashing password
    addNewUserRequest.password = await bcrypt.hash(
      addNewUserRequest.password,
      10,
    );
    // add new user
    const user = await this.userRepository.insert(addNewUserRequest);

    const dto: UserResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    return dto;
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

  async findByBagdeNum(usrBadgeNum: string): Promise<UserModel> {
    this.logger.debug(
      `UserService.findByBadgeNum ${JSON.stringify(usrBadgeNum)}`,
    );

    const user = await this.userRepository.findByBadgeNum(usrBadgeNum);
    if (!user) {
      throw new HttpException('Badge Number Invalid', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
