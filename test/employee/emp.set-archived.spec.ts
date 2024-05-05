import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { CreateRotationDto } from '../../src/rotation/dto/create-rotation.dto';

describe('Employee Controller - add new employee', () => {
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

  describe('POST /api/auth/employees/archive', () => {
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

      const empID = 'd4137957-7a5f-4e2e-b545-7fa4299c90fa';
      const endDate: CreateRotationDto = {
        endDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/employees/archive/${empID}`)
        .set('Authorization', '')
        .send(endDate);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if authenticated user is supervisor', async () => {
      logger.info(
        '========== should be rejected if authenticated user is supervisor ==========',
      );

      await testService.createSupvUser();

      const loginData: LoginDto = {
        id: 'zs8566',
        password: 'zs8566',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const empID = 'd4137957-7a5f-4e2e-b545-7fa4299c90fa';
      const endDate: CreateRotationDto = {
        endDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/employees/archive/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(endDate);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to set archive date', async () => {
      logger.info('========== should be able to set archive date ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const empID = 'd4137957-7a5f-4e2e-b545-7fa4299c90fa';
      const endDate: CreateRotationDto = {
        endDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/employees/archive/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(endDate);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.rotation).toBeDefined();
    });
  });
});
