import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(usr: User): Promise<User> {
    // inserting new user to database
    const user = await this.prismaService.users.create({
      data: usr,
    });

    return user;
  }

  async findByBadgeNum(usrBadgeNum: string): Promise<User> {
    // finding user by badge number
    const user = await this.prismaService.users.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    // showing all user
    const users = await this.prismaService.users.findMany();

    return users;
  }

  async delete(usrBadgeNum: string): Promise<void> {
    // deleting user
    await this.prismaService.users.delete({
      where: {
        id: usrBadgeNum,
      },
    });
  }
}