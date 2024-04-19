import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { CreateEmployeeDto } from '../../src/employee/dto/create-employee.dto';

describe('User Controller - add new user', () => {
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
      await testService.deleteEmployee();
    });

    it('should be rejected if no authenticated user', async () => {
      logger.info(
        '========== should be rejected if no authenticated user ==========',
      );
      const data: CreateEmployeeDto = {
        id: '',
        name: '',
        profilePicture: '',
        dateOfBirth: null,
        createdAt: null,
        updatedAt: null,
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/employee')
        .set('Authorization', ' ')
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if authenticated user is supervisor', async () => {
      logger.info(
        '========== should be rejected if authenticated user is supervisor ==========',
      );

      await testService.createSupvUser();

      const data: CreateEmployeeDto = {
        id: '',
        name: '',
        profilePicture: '',
        dateOfBirth: null,
        createdAt: null,
        updatedAt: null,
      };

      const loginData: LoginDto = {
        id: 'zs8566',
        password: 'zs8566',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/auth/employee')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.FORBIDDEN);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request invalid', async () => {
      logger.info(
        '========== should be rejected if request invalid ==========',
      );

      const data: CreateEmployeeDto = {
        id: '',
        name: '',
        profilePicture: '',
        dateOfBirth: null,
        createdAt: null,
        updatedAt: null,
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/auth/employee')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if employee already exist', async () => {
      logger.info(
        '========== should be rejected if employee already exist ==========',
      );

      await testService.createEmployee();

      const data: CreateEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/auth/employee')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create new employee', async () => {
      logger.info(
        '========== should be able to create new employee ==========',
      );

      const data: CreateEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .post('/api/auth/employee')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe('zs8565');
      expect(response.body.data.name).toBe('Mordekhai Gerin');
      expect(response.body.data.profilePicture).toBeDefined();
      expect(response.body.data.dateOfBirth).toBeDefined();
      expect(response.body.data.createdAt).toBeDefined();
      expect(response.body.data.updatedAt).toBeDefined();
    });
  });
});
