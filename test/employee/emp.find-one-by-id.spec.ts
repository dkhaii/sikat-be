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
    const idFalse = '4630dc8d-a53a-4b33-b290-0bcf8f075feb';
    const idTrue = 'ea1fe4aa-c20d-457b-b5ee-fb79fc661f54';
    const idInvalid = '11111';

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
        .get(`/api/auth/employees/find/${idFalse}`)
        .set('Authorization', '');
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if no ID match', async () => {
      logger.info('========== should be rejected if no ID match ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${idInvalid}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if employee not affected by effective date', async () => {
      logger.info(
        '========== should be rejected if employee not affected by effective date ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${idTrue}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to find one by ID', async () => {
      logger.info('========== should be able to find one by ID ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .get(`/api/auth/employees/find/${idFalse}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.employee.id).toBe(idFalse);
    });
  });
});
