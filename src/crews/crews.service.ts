import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CrewsRepository } from './crews.repository';
import { CrewDto } from './dto/crew.dto';

@Injectable()
export class CrewsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) logger: Logger,
    private crewsRepository: CrewsRepository,
  ) {}

  async findOneByID(id: number): Promise<CrewDto> {
    const crew = await this.crewsRepository.findOneByID(id);
    // console.log(JSON.stringify(crew, null, 2));
    console.log(crew);

    if (crew == null) {
      throw new HttpException('crew not found', HttpStatus.NOT_FOUND);
    }

    return crew;
  }
}
