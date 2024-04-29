import { Module } from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RotationRepository } from './rotation.repository';
import { RotationController } from './rotation.controller';

@Module({
  controllers: [RotationController],
  providers: [RotationService, RotationRepository],
  exports: [RotationService],
})
export class RotationModule {}
