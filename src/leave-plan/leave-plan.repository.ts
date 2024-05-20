import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { LeavePlan } from './entities/leave-plan.entity';
import { LeavePlanDto } from './dto/leave-plan.dto';
// import { UpdateLeavePlanDto } from './dto/update-leave-plan.dto';

@Injectable()
export class LeavePlanRepository {
  constructor(private prismaService: PrismaService) {}

  async insert(lp: LeavePlan): Promise<LeavePlanDto> {
    const createdLeavePlan = await this.prismaService.leavePlan.create({
      data: {
        employeeID: lp.employeeID,
        startDate: lp.startDate,
        endDate: lp.endDate,
        leaveStatusID: lp.leaveStatusID,
        isApproved: lp.isApproved,
        formCuti: lp.formCuti,
        createdAt: lp.createdAt,
        updatedAt: lp.updatedAt,
      },
      include: {
        leaveStatus: true,
      },
    });

    const createdLeavePlanDto = await this.mapEntityToDto(createdLeavePlan);

    return createdLeavePlanDto;
  }

  async findOneByID(id: number): Promise<LeavePlanDto | null> {
    const leavePlan = await this.prismaService.leavePlan.findUnique({
      where: {
        id: id,
      },
      include: {
        leaveStatus: true,
      },
    });

    if (leavePlan) {
      const leavePlanDto = await this.mapEntityToDto(leavePlan);

      return leavePlanDto;
    }

    return null;
  }

  async showAllWithFilterByMonth(
    year: number,
    month: number,
  ): Promise<LeavePlanDto[]> {
    const filterStartDate = new Date(year, month - 1, 1);
    const filterEndDate = new Date(year, month, 0, 23, 59, 59, 999);

    const leavePlans = await this.prismaService.leavePlan.findMany({
      where: {
        startDate: {
          gte: filterStartDate,
          lte: filterEndDate,
        },
      },
      include: {
        leaveStatus: true,
      },
    });

    const leavePlanDto: LeavePlanDto[] = await Promise.all(
      leavePlans.map(async (lp) => await this.mapEntityToDto(lp)),
    );

    return leavePlanDto;
  }

  async update(id: number, lp: Partial<LeavePlan>): Promise<LeavePlanDto> {
    const updatedLeavePlan = await this.prismaService.leavePlan.update({
      where: {
        id: id,
      },
      data: {
        startDate: lp.startDate,
        endDate: lp.endDate,
        leaveStatusID: lp.leaveStatusID,
        formCuti: lp.formCuti,
        isApproved: lp.isApproved,
        updatedAt: lp.updatedAt,
      },
      include: {
        leaveStatus: true,
      },
    });

    const updatedLeavePlanDto = await this.mapEntityToDto(updatedLeavePlan);

    return updatedLeavePlanDto;
  }

  async attachFormCuti(id: number, formCuti: string): Promise<LeavePlanDto> {
    const updatedLeavePlan = await this.prismaService.leavePlan.update({
      where: {
        id: id,
      },
      data: {
        formCuti: formCuti,
      },
      include: {
        leaveStatus: true,
      },
    });

    const updatedLeavePlanDto = await this.mapEntityToDto(updatedLeavePlan);

    return updatedLeavePlanDto;
  }

  async remove(id: number): Promise<void> {
    await this.prismaService.leavePlan.delete({
      where: {
        id: id,
      },
    });
  }

  private async mapEntityToDto(leavePlan: LeavePlan): Promise<LeavePlanDto> {
    const leavePlanDto: LeavePlanDto = {
      employeeID: leavePlan.employeeID,
      startDateStr: leavePlan.startDate.toLocaleDateString(),
      endDateStr: leavePlan.endDate.toLocaleDateString(),
      leaveStatusName: leavePlan.leaveStatus.name,
      formCuti: leavePlan.formCuti,
      isApproved: leavePlan.isApproved,
      createdAtStr: leavePlan.createdAt.toLocaleString(),
      updatedAtStr: leavePlan.updatedAt.toLocaleString(),
    };

    console.log(leavePlanDto);

    return leavePlanDto;
  }
}
