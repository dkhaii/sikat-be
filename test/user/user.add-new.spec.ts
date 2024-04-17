import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { AddNewUserDto } from '../../src/user/dto/add-new-user.dto';
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
      const data: AddNewUserDto = {
        id: '',
        password: '',
        name: '',
        roleID: null,
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/users')
        .set('Authorization', ' ')
        .send(data);
      logger.info(response.body);

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      logger.info(
        '========== should be rejected if request is invalid ==========',
      );

      const addNewUserData: AddNewUserDto = {
        id: '',
        password: '',
        name: '',
        roleID: null,
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const addNewUserResponse = await request(app.getHttpServer())
        .post('/api/auth/users')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(addNewUserData);
      logger.info(addNewUserResponse.body);

      expect(addNewUserResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(addNewUserResponse.body.errors).toBeDefined();
    });

    it('should be able to add new user', async () => {
      logger.info('========== should be able to add new user ==========');

      const addNewUserData: AddNewUserDto = {
        id: 'zs8565',
        password: 'zs8565',
        name: 'Mordekhai Gerin',
        roleID: 1,
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const addNewUserResponse = await request(app.getHttpServer())
        .post('/api/auth/users')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(addNewUserData);
      logger.info(addNewUserResponse.body);

      expect(addNewUserResponse.status).toBe(HttpStatus.OK);
      expect(addNewUserResponse.body.data.id).toBe(addNewUserData.id);
      expect(addNewUserResponse.body.data.name).toBe(addNewUserData.name);
    });

    it('should be fail inserting new user if user exist', async () => {
      logger.info(
        '========== should be fail inserting new user if user exist ==========',
      );

      await testService.createUser();

      const addNewUserData: AddNewUserDto = {
        id: 'zs8565',
        password: 'zs8565',
        name: 'Mordekhai Gerin',
        roleID: 1,
      };

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const addNewUserResponse = await request(app.getHttpServer())
        .post('/api/auth/users')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(addNewUserData);
      logger.info(addNewUserResponse.body);

      expect(addNewUserResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(addNewUserResponse.body.errors).toBeDefined();
    });
  });
});
