import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Param,
  UseInterceptors,
  UploadedFile,
  Get,
  StreamableFile,
  Header,
  Res,
  Patch,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { LeavePlanService } from './leave-plan.service';
import { CreateLeavePlanDto } from './dto/create-leave-plan.dto';
import { WebResponse } from '../dto/web.dto';
import { LeavePlanDto } from './dto/leave-plan.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  MulterFileOption,
  FilePipeBuilderPDFOption,
} from '../common/file-upload.config';
import { Response } from 'express';
import { UpdateLeavePlanDto } from './dto/update-leave-plan.dto';
import { Roles } from '../common/role/role.decorator';
import { RolesGuard } from '../common/role/role.guard';
import { Role } from '../common/role/role.enum';

@Controller('/api/auth/leave-plan')
export class LeavePlanController {
  constructor(private readonly leavePlanService: LeavePlanService) {}

  @Post('/book/:empID')
  @UseInterceptors(
    FileInterceptor('form_cuti', {
      storage: MulterFileOption,
    }),
  )
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('empID') empID: string,
    @Body() dto: CreateLeavePlanDto,
    @UploadedFile(FilePipeBuilderPDFOption)
    formCuti?: Express.Multer.File,
  ): Promise<WebResponse<{ leavePlan: LeavePlanDto }>> {
    const createdLeavePlan = await this.leavePlanService.create(
      empID,
      dto,
      formCuti,
    );

    const response: WebResponse<{ leavePlan: LeavePlanDto }> = {
      message: 'success',
      data: {
        leavePlan: createdLeavePlan,
      },
    };

    return response;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getOneByID(
    @Param('id') id: string,
  ): Promise<WebResponse<{ leavePlan: LeavePlanDto }>> {
    const leavePlanID = parseInt(id);

    const leavePlan = await this.leavePlanService.getOneByID(leavePlanID);

    const response: WebResponse<{ leavePlan: LeavePlanDto }> = {
      message: 'success',
      data: {
        leavePlan: leavePlan,
      },
    };

    return response;
  }

  @Get('/read-file/:id')
  @Header('Content-Type', 'application/pdf')
  @HttpCode(HttpStatus.OK)
  async readFormCuti(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const idFormCuti = parseInt(id);

    const [formCutiFile, formCutiName] =
      await this.leavePlanService.readFormCuti(idFormCuti);

    console.log('file name: ', formCutiName);

    res.set({
      'Content-Disposition': `attachment; filename=${formCutiName}`,
    });

    return new StreamableFile(formCutiFile);
  }

  @Get('/show/:month')
  @HttpCode(HttpStatus.OK)
  async showAllWithFilterByMonth(
    @Param('month') month: string,
  ): Promise<WebResponse<{ leavePlanData: LeavePlanDto[] }>> {
    const monthToNumber = parseInt(month);

    const leavePlans =
      await this.leavePlanService.showAllWithFilterByMonth(monthToNumber);

    console.log('leave plan datas: ', leavePlans);

    const response: WebResponse<{ leavePlanData: LeavePlanDto[] }> = {
      message: 'success',
      data: {
        leavePlanData: leavePlans,
      },
    };

    return response;
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  async updatePlan(
    @Param('id') id: string,
    @Body() dto: UpdateLeavePlanDto,
  ): Promise<WebResponse<{ leavePlan: LeavePlanDto }>> {
    const leavePlanID = parseInt(id);

    const updatedLeavePlan = await this.leavePlanService.update(
      leavePlanID,
      dto,
    );

    const response: WebResponse<{ leavePlan: LeavePlanDto }> = {
      message: 'success',
      data: {
        leavePlan: updatedLeavePlan,
      },
    };

    return response;
  }

  @Post('/attach-form-cuti/:id')
  @UseInterceptors(
    FileInterceptor('form_cuti', {
      storage: MulterFileOption,
    }),
  )
  @HttpCode(HttpStatus.OK)
  async attachFormCuti(
    @Param('id') id: string,
    @UploadedFile(FilePipeBuilderPDFOption) formCuti: Express.Multer.File,
  ): Promise<WebResponse<{ leavePlan: LeavePlanDto }>> {
    const leavePlanID = parseInt(id);

    const updatedLeavePlan = await this.leavePlanService.attachFormCuti(
      leavePlanID,
      formCuti,
    );

    const response: WebResponse<{ leavePlan: LeavePlanDto }> = {
      message: 'success',
      data: {
        leavePlan: updatedLeavePlan,
      },
    };

    return response;
  }

  @Patch('/approve/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERINTENDENT)
  @HttpCode(HttpStatus.OK)
  async approvePlan(
    @Param('id') id: string,
  ): Promise<WebResponse<{ leavePlan: LeavePlanDto }>> {
    const leavePlanID = parseInt(id);

    const approvedLeavePlan =
      await this.leavePlanService.approvePlan(leavePlanID);

    const response: WebResponse<{ leavePlan: LeavePlanDto }> = {
      message: 'success',
      data: {
        leavePlan: approvedLeavePlan,
      },
    };

    return response;
  }

  @Delete('/remove/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<WebResponse<void>> {
    const leavePlanID = parseInt(id);

    await this.leavePlanService.remove(leavePlanID);

    const response: WebResponse<void> = {
      message: 'success remove plan',
    };

    return response;
  }
}
