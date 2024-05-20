import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLeavePlanDto } from './dto/create-leave-plan.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { LeavePlanRepository } from './leave-plan.repository';
import { LeavePlanDto } from './dto/leave-plan.dto';
import { LeavePlan } from './entities/leave-plan.entity';
import { join } from 'path';
import { MulterConfig } from '../common/file-upload.config';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { UpdateLeavePlanDto } from './dto/update-leave-plan.dto';

@Injectable()
export class LeavePlanService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private leavePlanRepository: LeavePlanRepository,
  ) {}

  async create(
    empID: string,
    dto: CreateLeavePlanDto,
    formCuti?: Express.Multer.File,
  ): Promise<LeavePlanDto> {
    this.logger.info(`LeavePlanService.create ${JSON.stringify(dto)}`);
    console.log(dto);
    console.log(empID);

    const createdAt = new Date();
    const leavePlan = new LeavePlan();
    leavePlan.employeeID = empID;
    leavePlan.startDate = new Date(dto.startDate);
    leavePlan.endDate = new Date(dto.endDate);
    leavePlan.leaveStatusID = parseInt(dto.leaveStatusID);
    leavePlan.createdAt = createdAt;
    leavePlan.updatedAt = createdAt;

    if (formCuti) {
      leavePlan.formCuti = formCuti.filename;
    }

    const createdLeavePlan = await this.leavePlanRepository.insert(leavePlan);

    return createdLeavePlan;
  }

  async getOneByID(id: number): Promise<LeavePlanDto> {
    this.logger.info(`LeavePlanService.getOneByID ${JSON.stringify(id)}`);

    const leavePlan = await this.leavePlanRepository.findOneByID(id);
    if (leavePlan == null) {
      throw new HttpException('laeave plan not found', HttpStatus.NOT_FOUND);
    }

    return leavePlan;
  }

  async readFormCuti(id: number): Promise<[ReadStream, string]> {
    this.logger.info(`LeavePlanService.readFormCuti ${JSON.stringify(id)}`);

    const leavePlan = await this.getOneByID(id);

    if (!leavePlan.formCuti) {
      throw new HttpException('file not found', HttpStatus.NOT_FOUND);
    }

    const formCuti = join(MulterConfig.fileDestination, leavePlan.formCuti);

    if (!existsSync(formCuti)) {
      throw new HttpException('file not found', HttpStatus.NOT_FOUND);
    }

    const fileStream = createReadStream(formCuti);

    return [fileStream, leavePlan.formCuti];
  }

  async showAllWithFilterByMonth(month: number): Promise<LeavePlanDto[]> {
    this.logger.info(`LeavePlanService.showAllWithFilterByMonth ${month}`);

    const currentYear = new Date().getFullYear();

    const leavePlans = await this.leavePlanRepository.showAllWithFilterByMonth(
      currentYear,
      month,
    );

    return leavePlans;
  }

  async update(id: number, dto: UpdateLeavePlanDto): Promise<LeavePlanDto> {
    this.logger.info(`LeavePlanService.update ${dto}`);
    console.log(dto);

    const existingLeavePlan = await this.leavePlanRepository.findOneByID(id);
    if (existingLeavePlan == null) {
      throw new HttpException('leave plan not found', HttpStatus.NOT_FOUND);
    }

    const updatedAt = new Date();
    const leavePlan: Partial<LeavePlan> = {};
    leavePlan.updatedAt = updatedAt;

    if (dto.startDate) {
      leavePlan.startDate = new Date(dto.startDate);
    }

    if (dto.endDate) {
      leavePlan.endDate = new Date(dto.endDate);
    }

    if (dto.leaveStatusID) {
      leavePlan.leaveStatusID = parseInt(dto.leaveStatusID);
    }

    console.log(leavePlan);

    const updatedLeavePlan = await this.leavePlanRepository.update(
      id,
      leavePlan,
    );

    return updatedLeavePlan;
  }

  async attachFormCuti(
    id: number,
    formCuti: Express.Multer.File,
  ): Promise<LeavePlanDto> {
    this.logger.info(`LeavePlanService.attachFormCuti ${formCuti}`);
    console.log(formCuti);

    const existingLeavePlan = await this.leavePlanRepository.findOneByID(id);
    if (existingLeavePlan == null) {
      throw new HttpException('leave plan not found', HttpStatus.NOT_FOUND);
    }

    if (!formCuti) {
      throw new HttpException(
        'no form cuti attached',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const leavePlan = await this.leavePlanRepository.update(id, {
      formCuti: formCuti.filename,
    });

    return leavePlan;
  }

  async approvePlan(id: number): Promise<LeavePlanDto> {
    this.logger.info(`LeavePlanService.approvePlan ${id}`);

    const existingLeavePlan = await this.leavePlanRepository.findOneByID(id);
    if (!existingLeavePlan) {
      throw new HttpException('leave plan not found', HttpStatus.NOT_FOUND);
    }

    const approvedPlan = await this.leavePlanRepository.update(id, {
      isApproved: true,
    });

    return approvedPlan;
  }

  async remove(id: number): Promise<void> {
    this.logger.info(`leavePlanService.remove ${id}`);

    const existingLeavePlan = await this.leavePlanRepository.findOneByID(id);
    if (existingLeavePlan == null) {
      throw new HttpException('leave plan not found', HttpStatus.NOT_FOUND);
    }

    await this.leavePlanRepository.remove(id);

    const isExist = await this.leavePlanRepository.findOneByID(id);
    if (isExist) {
      throw new HttpException(
        'failed to remove plan',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
