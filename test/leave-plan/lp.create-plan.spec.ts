import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { CreateLeavePlanDto } from '../../src/leave-plan/dto/create-leave-plan.dto';
import { LeaveStatus } from '../../src/leave-plan/enums/leave-status.enum';

describe('Leave Plan Controller - book leave plan', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/auth/leave-plan/book', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    const empID = 'b1121f9b-f59b-47df-b82b-b478b4465977';

    it('should be rejected if no authenticated user', async () => {
      logger.info(
        '========== should be rejected if no authenticated user ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const createLeavePlanDto: CreateLeavePlanDto = {
        startDate: '2024-6-15',
        endDate: '2024-6-23',
        leaveStatusID: `${LeaveStatus.ANNUAL_LEAVE}`,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/book/${empID}`)
        .set('Authorization', '')
        .send(createLeavePlanDto);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to book leave plan with form cuti', async () => {
      logger.info(
        '========== should be able to book leave plan with form cuti ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const createLeavePlanDto: CreateLeavePlanDto = {
        startDate: '2024-6-15',
        endDate: '2024-6-23',
        leaveStatusID: `${LeaveStatus.ANNUAL_LEAVE}`,
      };
      const filePath = './test/leave-plan/form-cuti/form_cuti_saya.pdf';
      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/book/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .set('Content-Type', 'multipart/form-data')
        .field('startDate', createLeavePlanDto.startDate)
        .field('endDate', createLeavePlanDto.endDate)
        .field('leaveStatusID', `${createLeavePlanDto.leaveStatusID}`)
        .attach('form_cuti', filePath);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.leavePlan).toBeDefined();
    });

    it('should be able to book leave plan without form cuti inputed', async () => {
      logger.info(
        '========== should be able to book leave plan without form cuti inputed ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const createLeavePlanDto: CreateLeavePlanDto = {
        startDate: '2024-6-15',
        endDate: '2024-6-23',
        leaveStatusID: `${LeaveStatus.ANNUAL_LEAVE}`,
      };
      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/book/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .set('Content-Type', 'multipart/form-data')
        .field('startDate', createLeavePlanDto.startDate)
        .field('endDate', createLeavePlanDto.endDate)
        .field('leaveStatusID', `${createLeavePlanDto.leaveStatusID}`);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.leavePlan).toBeDefined();
    });
  });
});
