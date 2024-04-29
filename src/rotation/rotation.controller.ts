import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RolesGuard } from 'src/common/role/role.guard';
import { Roles } from 'src/common/role/role.decorator';
import { Role } from 'src/common/role/role.enum';
import { CreateRotationDto } from './dto/create-rotation.dto';
import { WebResponse } from '../dto/web.dto';
import { RotationDto } from './dto/rotation.dto';

@Controller('/api/auth/rotation')
export class RotationController {
  constructor(private rotationService: RotationService) {}

  @Post('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('id') id: string,
    @Body() dto: CreateRotationDto,
  ): Promise<WebResponse<RotationDto>> {
    const rotation = await this.rotationService.create(id, dto);

    const response: WebResponse<RotationDto> = {
      message: 'success create rotation',
      data: rotation,
    };

    return response;
  }
}
