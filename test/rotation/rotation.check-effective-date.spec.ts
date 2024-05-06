import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('Rotation Controller - create rotation', () => {
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

  describe('PATCH /api/auth/rotation/check/effective-date-and-update-employee', () => {
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

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/effective-date`)
        .set('Authorization', '');
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to update employee when effective date is match with current date', async () => {
      logger.info(
        '========== should be able to update employee when effective date is match with current date ==========',
      );

      await testService.createEmployeeWithSettedRotation('2024-5-4');
      await testService.createEmployeeWithEffectiveDate('2024-5-4');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      jest
        .useFakeTimers({ advanceTimers: true })
        .setSystemTime(new Date(2024, 4, 5));

      const response = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/effective-date`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.updatedEmployeeData).toBeDefined();
      expect(response.body.data.unarchivedEmployeeData).toBeDefined();
      expect(response.body.data.createdEmployeeLogData).toBeDefined();

      jest.useRealTimers();
    });
  });
});
