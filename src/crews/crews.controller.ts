import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { CrewsService } from './crews.service';
import { WebResponse } from 'src/dto/web.dto';
import { CrewDto } from './dto/crew.dto';
// import { Crew } from './entities/crew.entity';

@Controller('/api/auth/crew')
export class CrewsController {
  constructor(private crewsService: CrewsService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOneByID(
    @Param('id') id: string,
  ): Promise<WebResponse<{ crew: CrewDto }>> {
    const crewID = parseInt(id);

    const crew = await this.crewsService.findOneByID(crewID);

    const response: WebResponse<{ crew: CrewDto }> = {
      message: 'success',
      data: {
        crew: crew,
      },
    };

    return response;
  }
}
