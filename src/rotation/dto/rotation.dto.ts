import { PartialType } from '@nestjs/mapped-types';
import { Rotation } from '../entities/rotation.entity';

export class RotationDto extends PartialType(Rotation) {
  effectiveDateStr?: string;
  endDateStr?: string;
  createdAtStr?: string;
  udpatedAtStr?: string;
}
