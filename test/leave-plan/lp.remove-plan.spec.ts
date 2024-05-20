import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { LeaveStatus } from '../../src/leave-plan/enums/leave-status.enum';
import { UpdateLeavePlanDto } from '../../src/leave-plan/dto/update-leave-plan.dto';

describe('Leave Plan Controller - update leave plan', () => {
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

  describe('PATCH /api/auth/leave-plan/book', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

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

      const updateLeavePlan: UpdateLeavePlanDto = {
        startDate: '2024-5-15',
        endDate: '2024-5-23',
        leaveStatusID: `${LeaveStatus.BUSINESS_TRIP}`,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/leave-plan/update/${2}`)
        .set('Authorization', '')
        .send(updateLeavePlan);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to remove plan', async () => {
      logger.info('========== should be able to remove plan ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const deleteLeavePlanResponse = await request(app.getHttpServer())
        .delete(`/api/auth/leave-plan/remove/${2}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(deleteLeavePlanResponse.body);

      expect(deleteLeavePlanResponse.status).toBe(HttpStatus.OK);
      expect(deleteLeavePlanResponse.body.message).toBeDefined();
    });

    it('should be rejected if no id match', async () => {
      logger.info('========== should be rejected if no id match ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const deleteLeavePlanResponse = await request(app.getHttpServer())
        .delete(`/api/auth/leave-plan/remove/${10}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(deleteLeavePlanResponse.body);

      expect(deleteLeavePlanResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(deleteLeavePlanResponse.body.errors).toBeDefined();
    });
  });
});
