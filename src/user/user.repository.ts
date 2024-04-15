import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserModel } from 'src/model/user.model';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(usr: UserModel): Promise<UserModel> {
    // insert to database
    const user = await this.prismaService.user.create({
      data: usr,
    });

    return user;
  }

  async findByBadgeNum(usrBadgeNum: string): Promise<UserModel> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }

  async updateToken(usr: UserModel, token: string): Promise<string> {
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
