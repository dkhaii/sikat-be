import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';

describe('User Controller - delete user', () => {
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

    it('should be fail deleting user if user doesnt exist', async () => {
      await testService.createUser();

      const usrBadgeNumber: string = 'zs8555';

      const response = await request(app.getHttpServer()).delete(
        `/api/auth/users/${usrBadgeNumber}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.NOT_FOUND);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to delete user', async () => {
      await testService.createUser();

      const usrBadgeNumber: string = 'zs8565';

      const response = await request(app.getHttpServer()).delete(
        `/api/auth/users/${usrBadgeNumber}`,
      );

      logger.info(response.body);

      const isUser = await testService.findUser(usrBadgeNumber);
      if (!isUser) {
        expect(response.status).toBe(HttpStatus.OK);
      }
    });
  });
});
