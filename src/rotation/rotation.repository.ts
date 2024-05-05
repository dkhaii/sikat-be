import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Rotation } from './entities/rotation.entity';
import { UpdateRotationDto } from './dto/update-rotation.dto';
// import { RotationDto } from './dto/rotation.dto';

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

  async countSameEmployeeID(empID: string): Promise<number> {
    const rotation = await this.prismaService.rotation.count({
      where: {
        employeeID: empID,
      },
    });

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

  async delete(empID: string): Promise<void> {
    await this.prismaService.rotation.delete({
      where: {
        employeeID: empID,
      },
    });
  }

  // private async mapEntityToDto(rotation: Rotation): Promise<RotationDto> {
  //   const rotaionDto: RotationDto = {
  //     employeeID: rotation.employeeID,
  //     effectiveDateStr: rotation.effectiveDate.toLocaleString('id-ID', {dateStyle: 'short'}),
  //     endDateStr: rotation.endDate.toLocaleString('id-ID', {dateStyle: 'short'})
  //     positionID?: number;
  //     crewID?: number;
  //     pitID?: number;
  //     baseID?: number;
  //     createdAt: Date;
  //     updatedAt: Date;
  //   }
  // }
}
