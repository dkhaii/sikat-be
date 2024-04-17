import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

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

  describe('POST /api/auth/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    });

    it('should be rejected if no authenticated user', async () => {
      logger.info(
        '========== should be rejected if no authenticated user ==========',
      );

      const response = await request(app.getHttpServer())
        .get('/api/auth/users')
        .set('Authorization', ' ');
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
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

      const getAllUserResponse = await request(app.getHttpServer())
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(getAllUserResponse.body);

      expect(getAllUserResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(getAllUserResponse.body.errors).toBeDefined();
    });

    it('should be able to get all users', async () => {
      logger.info('========== should be able to get all users ==========');

      await testService.createSuptUser();

      const loginData: LoginDto = {
        id: 'zs8565',
        password: 'zs8565',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const getAllUserResponse = await request(app.getHttpServer())
        .get('/api/auth/users')
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(getAllUserResponse.body);

      expect(getAllUserResponse.status).toBe(HttpStatus.OK);
      expect(getAllUserResponse.body.data).toBeDefined();
    });
  });
});
