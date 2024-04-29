import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Rotation } from './entities/rotation.entity';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Injectable()
export class RotationRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(rtn: Rotation): Promise<Rotation> {
    const rotation = await this.prismaService.rotation.create({
      data: rtn,
    });

    return rotation;
  }

  async showAll(): Promise<Rotation[]> {
    const rotations = await this.prismaService.rotation.findMany();

    return rotations;
  }

  async findOneByEmpID(empID: string): Promise<Rotation | null> {
    const rotation = await this.prismaService.rotation.findFirst({
      where: {
        employeeID: empID,
      },
    });

    if (!rotation) {
      return null;
    }

    return rotation;
  }

  async update(empID: string, dto: UpdateRotationDto): Promise<Rotation> {
    const rotation = await this.prismaService.rotation.update({
      where: {
        employeeID: empID,
      },
      data: dto,
    });

    return rotation;
  }
}
