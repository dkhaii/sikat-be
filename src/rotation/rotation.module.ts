import { Module } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RotationRepository } from './rotation.repository';

@Module({
  providers: [RotationService, RotationRepository],
  exports: [RotationService],
})
export class RotationModule {}
