import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { AddNewUserRequest } from '../../src/dto/user.dto';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';

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

    it('should be rejected if request is invalid', async () => {
      const data: AddNewUserRequest = {
        id: '',
        password: '',
        name: '',
        role: null,
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/users')
        .send(data);

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to add new user', async () => {
      const data: AddNewUserRequest = {
        id: 'zs8565',
        password: 'zs8565',
        name: 'Mordekhai Gerin',
        role: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/users')
        .send(data);

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.id).toBe(data.id);
      expect(response.body.data.name).toBe(data.name);
    });

    it('should be fail inserting new user if user exist', async () => {
      await testService.createUser();

      const data: AddNewUserRequest = {
        id: 'zs8565',
        password: 'zs8565',
        name: 'Mordekhai Gerin',
        role: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/users')
        .send(data);

      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.errors).toBeDefined();
    });
  });
});
