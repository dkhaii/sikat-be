import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';

describe('Leave Plan Controller - read pdf file', () => {
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

  describe('GET /api/auth/leave-plan/read-file', () => {
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

      const formCutiResponse = await request(app.getHttpServer())
        .get(`/api/auth/leave-plan/read-file/${5}`)
        .set('Authorization', '');
      logger.info(formCutiResponse.body);

      expect(formCutiResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(formCutiResponse.body.errors).toBeDefined();
    });

    it('should be able read pdf file', async () => {
      logger.info('========== should be able read pdf file ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const formCutiResponse = await request(app.getHttpServer())
        .get(`/api/auth/leave-plan/read-file/${5}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .expect('Content-Type', /application\/pdf/);
      logger.info(formCutiResponse.body);

      expect(formCutiResponse.status).toBe(HttpStatus.OK);
      expect(formCutiResponse.headers['content-disposition']).toContain(
        'attachment; filename=1715819638863-11258134-d538-493a-9d91-33aba9406a32.pdf',
      );
    });

    it('should be return error not found rejected if file not found', async () => {
      logger.info(
        '========== should be return error not found rejected if file not found ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const formCutiResponse = await request(app.getHttpServer())
        .get(`/api/auth/leave-plan/read-file/${6}`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(formCutiResponse.body);

      expect(formCutiResponse.status).toBe(HttpStatus.NOT_FOUND);
    });
  });
});
