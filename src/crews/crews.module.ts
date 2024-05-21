import { Module } from '@nestjs/common';
import { CrewsService } from './crews.service';
import { CrewsController } from './crews.controller';
import { CrewsRepository } from './crews.repository';

@Module({
  controllers: [CrewsController],
  providers: [CrewsService, CrewsRepository],
})
export class CrewsModule {}
