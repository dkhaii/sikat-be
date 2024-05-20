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

    it('should be able to update leave plan WITHOUT form cuti', async () => {
      logger.info(
        '========== should be able to update leave plan WITHOUT form cuti ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const updateLeavePlan: UpdateLeavePlanDto = {
        // startDate: '2024-5-15',
        // endDate: '2024-5-23',
        leaveStatusID: `${LeaveStatus.SICK_LEAVE}`,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/leave-plan/update/${2}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(updateLeavePlan);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.leavePlan).toBeDefined();
    });

    it('should be rejected to update leave plan WITHOUT form cuti if no leave plan id exist', async () => {
      logger.info(
        '========== should be rejected to update leave plan WITHOUT form cuti if no leave plan id exist ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const updateLeavePlan: UpdateLeavePlanDto = {
        // startDate: '2024-5-15',
        // endDate: '2024-5-23',
        leaveStatusID: `${LeaveStatus.SICK_LEAVE}`,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/leave-plan/update/${10}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(updateLeavePlan);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to attach form cuti to update null form cuti', async () => {
      logger.info(
        '========== should be able to attach form cuti to update null form cuti ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const filePath = './test/leave-plan/form-cuti/form_cuti_saya.pdf';

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/attach-form-cuti/${4}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('form_cuti', filePath);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.leavePlan).toBeDefined();
    });

    it('should be rejected to attach form cuti to update null form cuti if no leave plan id exist', async () => {
      logger.info(
        '========== should be rejected to attach form cuti to update null form cuti if no leave plan id exist ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const filePath = './test/leave-plan/form-cuti/form_cuti_saya.pdf';

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/attach-form-cuti/${10}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('form_cuti', filePath);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    // it('should be rejected to attach form cuti to update null form cuti if file is unprocessable', async () => {
    //   logger.info(
    //     '========== should be rejected to attach form cuti to update null form cuti if file is unprocessable ==========',
    //   );

    //   const loginData: LoginDto = {
    //     id: '111111',
    //     password: 'admin123',
    //   };
    //   const loginResponse = await testService.loginUser(loginData);
    //   expect(loginResponse.token).toBeDefined();

    //   const newEmployeeResponse = await request(app.getHttpServer())
    //     .post(`/api/auth/leave-plan/attach-form-cuti/${4}`)
    //     .set('Authorization', `Bearer ${loginResponse.token}`)
    //     .set('Content-Type', 'multipart/form-data')
    //     .attach('form_cuti', '');
    //   logger.info(newEmployeeResponse.body);

    //   expect(newEmployeeResponse.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    //   expect(newEmployeeResponse.body.errors).toBeDefined();
    // });

    it('should be rejected to attach form cuti to update null form cuti if file not attached', async () => {
      logger.info(
        '========== should be rejected to attach form cuti to update null form cuti if file not attached ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/leave-plan/attach-form-cuti/${4}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .set('Content-Type', 'multipart/form-data')
        .attach('form_cuti', '');
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be to approve plan', async () => {
      logger.info('========== should be to approve plan ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/leave-plan/approve/${4}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.leavePlan.isApproved).toBe(true);
    });
  });
});
