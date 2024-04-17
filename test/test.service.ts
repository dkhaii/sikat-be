import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '../src/user/user.entity';
import { LoginDto } from '../src/auth/dto/login.dto';
import { AuthService } from '../src/auth/auth.service';

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private authServie: AuthService,
  ) {}

  async loginUser(loginDto: LoginDto) {
    const loginResponse = await this.authServie.login(loginDto);

    return loginResponse;
  }

  async deleteUser() {
    const userOne = await this.findUser('zs8565');
    if (userOne) {
      await this.prismaService.users.delete({
        where: {
          id: 'zs8565',
        },
      });
    }

    const userTwo = await this.findUser('zs8566');
    if (userTwo) {
      await this.prismaService.users.delete({
        where: {
          id: 'zs8566',
        },
      });
    }
  }

  async createSuptUser() {
    await this.prismaService.users.create({
      data: {
        id: 'zs8565',
        password: await bcrypt.hash('zs8565', 10),
        name: 'Supt. User',
        roleID: 1,
      },
    });
  }

  async createSupvUser() {
    await this.prismaService.users.create({
      data: {
        id: 'zs8566',
        password: await bcrypt.hash('zs8566', 10),
        name: 'Supv. User',
        roleID: 2,
      },
    });
  }

  async findUser(usrBadgeNum: string): Promise<User> {
    const user: User = await this.prismaService.users.findUnique({
      where: {
        id: usrBadgeNum,
      },
    });

    return user;
  }
}
