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
      await testService.createUser();
    });

    it('should be rejected if no authenticated user', async () => {
      const data: LoginDto = {
        id: 'zs8565',
        password: 'zs8565',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/api/login')
        .send(data);

      logger.info(loginResponse.body);

      const userProfileResponse = await request(app.getHttpServer()).get(
        '/api/profile',
      );

      logger.info(userProfileResponse.body);

      expect(userProfileResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(userProfileResponse.body.errors).toBeDefined();
    });

    it('should be able to get authenticated user profile', async () => {
      const data: LoginDto = {
        id: 'zs8565',
        password: 'zs8565',
      };

      const loginResponse = await request(app.getHttpServer())
        .post('/api/login')
        .send(data);

      logger.info(loginResponse.body);

      const userProfileResponse = await request(app.getHttpServer())
        .get('/api/profile')
        .set('Authorization', `Bearer ${loginResponse.body.data.token}`);

      logger.info(userProfileResponse.body);

      expect(userProfileResponse.status).toBe(HttpStatus.OK);
      expect(userProfileResponse.body.data).toBeDefined();
    });
  });
});
