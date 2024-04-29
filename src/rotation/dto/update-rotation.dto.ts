import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Rotation } from '../entities/rotation.entity';

export class UpdateRotationDto extends PartialType(
  OmitType(Rotation, ['employeeID', 'createdAt']),
) {}
