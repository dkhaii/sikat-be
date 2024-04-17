import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from 'src/auth/dto/login.dto';

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

    it('should be fail deleting user if no authenticated user', async () => {
      logger.info(
        '========== should be fail deleting user if no authenticated user ==========',
      );

      await testService.createSuptUser();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };

      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const usrBadgeNumber: string = 'zs8555';

      const deleteUserResponse = await request(app.getHttpServer())
        .delete(`/api/auth/users/${usrBadgeNumber}`)
        .set('Authorization', '');

      logger.info(deleteUserResponse.body);

      expect(deleteUserResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(deleteUserResponse.body.errors).toBeDefined();
    });

    it('should be fail deleting user if user doesnt exist', async () => {
      logger.info(
        '========== should be fail deleting user if user doesnt exist ==========',
      );

      await testService.createSuptUser();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };

      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const usrBadgeNumber: string = 'zs8555';

      const deleteUserResponse = await request(app.getHttpServer())
        .delete(`/api/auth/users/${usrBadgeNumber}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);

      logger.info(deleteUserResponse.body);

      expect(deleteUserResponse.status).toBe(HttpStatus.NOT_FOUND);
      expect(deleteUserResponse.body.errors).toBeDefined();
    });

    it('should be able to delete user', async () => {
      logger.info('========== should be able to delete user  ==========');

      await testService.createSuptUser();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };

      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const usrBadgeNumber: string = 'zs8565';

      const deleteUserResponse = await request(app.getHttpServer())
        .delete(`/api/auth/users/${usrBadgeNumber}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);

      logger.info(deleteUserResponse.body);

      const isUser = await testService.findUser(usrBadgeNumber);
      if (!isUser) {
        expect(deleteUserResponse.status).toBe(HttpStatus.OK);
      }
    });
  });
});
