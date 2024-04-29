import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { Positions } from '../../src/employee/enums/position.enum';
import { UpdateRotationDto } from '../../src/rotation/dto/update-rotation.dto';

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

  describe('POST /api/auth/employees/rotation', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    const empID = 'zs8565';

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

      const rotationData: UpdateRotationDto = {
        positionID: Positions.SUPERVISOR,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/employees/rotation/${empID}`)
        .set('Authorization', '')
        .send(rotationData);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if authenticated user is supervisor', async () => {
      logger.info(
        '========== should be rejected if authenticated user is supervisor ==========',
      );

      await testService.createSupvUser();
      await testService.createEmployee();

      const loginData: LoginDto = {
        id: 'zs8566',
        password: 'zs8566',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const rotationData: UpdateRotationDto = {
        positionID: Positions.SUPERVISOR,
        effectiveDate: new Date(2024, 4, 30),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/employees/rotation/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(rotationData);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to set rotation', async () => {
      logger.info('========== should be able to set rotation ==========');

      await testService.createEmployee();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const rotationData: UpdateRotationDto = {
        positionID: Positions.SUPERVISOR,
        effectiveDate: new Date(2024, 4, 30),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/employees/rotation/${empID}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(rotationData);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data).toBeDefined();
    });
  });
});
