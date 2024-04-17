import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from 'src/auth/dto/login.dto';

describe('Auth Controller - login', () => {
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

  describe('POST /api/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createSuptUser();
    });

    it('should be rejected if no authenticated user', async () => {
      logger.info(
        '========== should be rejected if no authenticated user ==========',
      );

      const loginData: LoginDto = {
        id: 'zs8565',
        password: 'zs8565',
      };

      const loginResopnse = await testService.loginUser(loginData);
      expect(loginResopnse.token).toBeDefined();

      const userProfileResponse = await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', '');

      logger.info(userProfileResponse.body);

      expect(userProfileResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(userProfileResponse.body.errors).toBeDefined();
    });

    it('should be able to get authenticated user profile', async () => {
      logger.info(
        '========== should be able to get authenticated user profile ==========',
      );

      const loginData: LoginDto = {
        id: 'zs8565',
        password: 'zs8565',
      };

      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const userProfileResponse = await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', `Bearer ${loginResponse.token}`);

      logger.info(userProfileResponse.body);

      expect(userProfileResponse.status).toBe(HttpStatus.OK);
      expect(userProfileResponse.body.data).toBeDefined();
    });
  });
});
