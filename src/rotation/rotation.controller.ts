import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RotationService } from './rotation.service';
import { RolesGuard } from '../common/role/role.guard';
import { Roles } from '../common/role/role.decorator';
import { Role } from '../common/role/role.enum';
import { WebResponse } from '../dto/web.dto';
import { RotationDto } from './dto/rotation.dto';
import { UpdateRotationDto } from './dto/update-rotation.dto';

@Controller('/api/auth/rotation')
export class RotationController {
  constructor(private rotationService: RotationService) {}

  @Patch('/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('id') id: string,
    @Body() dto: UpdateRotationDto,
  ): Promise<WebResponse<{ rotation: RotationDto }>> {
    const rotation = await this.rotationService.create(id, dto);

    const response: WebResponse<{ rotation: RotationDto }> = {
      message: 'success create rotation',
      data: {
        rotation: rotation,
      },
    };

    return response;
  }
}
