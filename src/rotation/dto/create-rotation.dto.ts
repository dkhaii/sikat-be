import { OmitType } from '@nestjs/mapped-types';
import { Rotation } from '../entities/rotation.entity';

export class CreateRotationDto extends OmitType(Rotation, [
  'employeeID',
  'createdAt',
  'updatedAt',
]) {}
