import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('Employee Controller - show all employee', () => {
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

  describe('POST /api/auth/employee', () => {
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

      const allEmployeeResponse = await request(app.getHttpServer())
        .get('/api/auth/employees')
        .set('Authorization', ' ');
      logger.info(allEmployeeResponse.body);

      expect(allEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(allEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to show all employee datas', async () => {
      logger.info(
        '========== should be able to show all employee datas ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const allEmployeeResponse = await request(app.getHttpServer())
        .get('/api/auth/employees')
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(allEmployeeResponse.body);

      expect(allEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(allEmployeeResponse.body.data).toBeDefined();
    });
  });
});
