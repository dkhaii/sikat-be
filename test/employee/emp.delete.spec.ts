import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

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

  describe('POST /api/auth/employees', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    const empID = 'zs8565';

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

      const updateEmployeeResponse = await request(app.getHttpServer())
        .delete(`/api/auth/employees/delete/${empID}`)
        .set('Authorization', ' ');
      logger.info(updateEmployeeResponse.body);

      expect(updateEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(updateEmployeeResponse.body.errors).toBeDefined();
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

      const updateEmployeeResponse = await request(app.getHttpServer())
        .delete(`/api/auth/employees/delete/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(updateEmployeeResponse.body);

      expect(updateEmployeeResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(updateEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if no employee exist', async () => {
      logger.info(
        '========== should be rejected if no employee exist ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const updateEmployeeResponse = await request(app.getHttpServer())
        .delete(`/api/auth/employees/delete/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(updateEmployeeResponse.body);

      expect(updateEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(updateEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to delete employee', async () => {
      logger.info('========== should be able to delete employee ==========');

      await testService.createEmployee();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const updateEmployeeResponse = await request(app.getHttpServer())
        .delete(`/api/auth/employees/delete/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(updateEmployeeResponse.body);

      expect(updateEmployeeResponse.status).toBe(HttpStatus.OK);
    });
  });
});
