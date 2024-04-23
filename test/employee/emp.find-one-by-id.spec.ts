import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('Employee Controller - find one by ID employee', () => {
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

  describe('POST /api/auth/employee/find/:id', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    const empID = 'e8f02c6e-44a5-46dc-9fb3-7d4e09a5d42a';

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

      const allEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${empID}`)
        .set('Authorization', '');
      logger.info(allEmployeeResponse.body);

      expect(allEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(allEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if no ID match', async () => {
      logger.info('========== should be rejected if no ID match ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const noEmpID = 'zs8658';
      const allEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${noEmpID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(allEmployeeResponse.body);

      expect(allEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(allEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to find one by ID employee', async () => {
      logger.info(
        '========== should be able to find one by ID employee ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const allEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(allEmployeeResponse.body);

      expect(allEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(allEmployeeResponse.body.data.id).toBe(empID);
    });
  });
});
