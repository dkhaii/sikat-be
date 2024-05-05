import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { RotationDto } from './dto/rotation.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { RotationRepository } from './rotation.repository';
import { Rotation } from './entities/rotation.entity';
import { ValidationService } from '../common/validation.service';
import { RotationValidation } from './rotation.validation';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Injectable()
export class RotationService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private rotationRepository: RotationRepository,
    private validationService: ValidationService,
  ) {}

  async create(empID: string, dto: CreateRotationDto): Promise<RotationDto> {
    this.logger.info(`RotationService.setRotation dto: ${JSON.stringify(dto)}`);
    this.logger.info(
      `RotationService.setRotation employee_id: ${JSON.stringify(empID)}`,
    );

    const validateDto: CreateRotationDto =
      await this.validationService.validate(RotationValidation.CREATE, dto);

    const isExist = await this.rotationRepository.countSameEmployeeID(empID);
    if (isExist !== 0) {
      const updatedAt = new Date();
      const rotation: UpdateRotationDto = {
        effectiveDate: validateDto.effectiveDate,
        positionID: validateDto.positionID,
        crewID: validateDto.crewID,
        pitID: validateDto.pitID,
        baseID: validateDto.baseID,
        updatedAt: updatedAt,
      };
      const updatedRotation = await this.rotationRepository.update(
        empID,
        rotation,
      );

      return updatedRotation;
    }

    const createdAt = new Date();
    const rotation: Rotation = {
      employeeID: empID,
      effectiveDate: validateDto.effectiveDate,
      positionID: validateDto.positionID,
      crewID: validateDto.crewID,
      pitID: validateDto.pitID,
      baseID: validateDto.baseID,
      createdAt: createdAt,
      updatedAt: createdAt,
    };
    const createdRotation = await this.rotationRepository.insert(rotation);

    return createdRotation;
  }

  async setEffectiveDate(
    empID: string,
    dto: CreateRotationDto,
  ): Promise<RotationDto> {
    this.logger.info(
      `RotationService.setEffectiveDate dto: ${JSON.stringify(dto)}`,
    );
    this.logger.info(
      `RotationService.setEffectiveDate employee_id: ${JSON.stringify(empID)}`,
    );

    const validatedDto: CreateRotationDto =
      await this.validationService.validate(RotationValidation.CREATE, dto);

    const isExist = await this.rotationRepository.findOneByEmpID(empID);
    if (isExist !== null) {
      if (typeof isExist.effectiveDate !== 'undefined') {
        throw new HttpException(
          `rotation employee_id: ${empID}, with effective_date already exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        `rotation employee_id: ${empID}, is already exist with endDate associated`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdAt = new Date();
    const rotation: Rotation = {
      employeeID: empID,
      effectiveDate: validatedDto.effectiveDate,
      createdAt: createdAt,
      updatedAt: createdAt,
    };

    const createdRotation = await this.rotationRepository.insert(rotation);

    return createdRotation;
  }

  async setEndDate(
    empID: string,
    dto: CreateRotationDto,
  ): Promise<RotationDto> {
    this.logger.info(`RotationService.setEndDate ${JSON.stringify(dto)}`);

    const validatedDto: CreateRotationDto =
      await this.validationService.validate(RotationValidation.CREATE, dto);

    const isExist = await this.rotationRepository.findOneByEmpID(empID);
    if (isExist !== null) {
      if (typeof isExist.createdAt !== 'undefined') {
        const updatedAt = new Date();
        const rotation: UpdateRotationDto = {
          endDate: validatedDto.endDate,
          updatedAt: updatedAt,
        };

        const updatedRotation = await this.rotationRepository.update(
          empID,
          rotation,
        );

        return updatedRotation;
      }
    }

    const createdAt = new Date();
    const rotation: Rotation = {
      employeeID: empID,
      endDate: validatedDto.endDate,
      createdAt: createdAt,
      updatedAt: createdAt,
    };

    const createdRotation = await this.rotationRepository.insert(rotation);

    return createdRotation;
  }

  async showAllAndThrow(): Promise<RotationDto[]> {
    this.logger.info('RotationService.showAll');

    const rotations = await this.rotationRepository.showAll();
    if (rotations.length === 0) {
      throw new HttpException('no records', HttpStatus.NOT_FOUND);
    }

    return rotations;
  }

  async showAll(): Promise<RotationDto[]> {
    this.logger.info('RotationService.showAll');

    const rotations = await this.rotationRepository.showAll();
    if (rotations.length === 0) {
      return [];
    }

    return rotations;
  }

  async findOneByEmpID(empID: string): Promise<RotationDto> {
    this.logger.info(`RotationService.findOneByEmpID ${JSON.stringify(empID)}`);

    const rotation = await this.rotationRepository.findOneByEmpID(empID);
    if (rotation == null) {
      throw new HttpException(
        `no records found with badge_number: ${empID}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return rotation;
  }

  async remove(empID: string): Promise<void> {
    this.logger.info(`RotationService.remove ${JSON.stringify(empID)}`);

    await this.rotationRepository.delete(empID);
  }

  private async checkIfExist(empID: string) {
    const isExist = await this.rotationRepository.findOneByEmpID(empID);
    if (isExist !== null) {
      if (typeof isExist.effectiveDate !== 'undefined') {
        throw new HttpException(
          `rotation employee_id: ${empID}, with effective_date already exist`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        `rotation employee_id: ${empID}, is already exist with endDate associated`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
