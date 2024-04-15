import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(usr: User): Promise<User> {
    // insert to database
    const user = await this.prismaService.user.create({
      data: usr,
    });

    return user;
  }

  async findByBadgeNum(usrBadgeNum: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prismaService.user.findMany();

    return users;
  }

  async updateToken(usr: User, token: string): Promise<string> {
    const user = await this.prismaService.user.update({
      where: {
        id: usr.id,
      },
      data: {
        token: token,
      },
    });

    return user.token;
  }

  async delete(usrBadgeNum: string): Promise<void> {
    await this.prismaService.user.delete({
      where: {
        id: usrBadgeNum,
      },
    });
  }
}
