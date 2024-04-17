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
    await this.prismaService.users.deleteMany({
      where: {
        id: 'zs8565',
      },
    });
  }

  async createUser() {
    await this.prismaService.users.create({
      data: {
        id: 'zs8565',
        password: await bcrypt.hash('zs8565', 10),
        name: 'Mordekhai Gerin',
        roleID: 1,
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
