import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import { UserModel } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        id: 'zs8565',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        id: 'zs8565',
        password: await bcrypt.hash('zs8565', 10),
        name: 'Mordekhai Gerin',
        role: 1,
      },
    });
  }

  async findUser(usrBadgeNum: string): Promise<UserModel> {
    const user: UserModel = await this.prismaService.user.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }
}
