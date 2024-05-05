import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { EmployeeDto } from 'src/employee/dto/employee.dto';

describe('Rotation Controller - create rotation', () => {
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

  describe('PATCH /api/auth/rotation/check/end-date', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    it('should be rejected if no authenticated user', async () => {
      logger.info(
        '========== should be rejected if no authenticated user ==========',
      );

      await testService.createEmployee();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeResponse = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/end-date`)
        .set('Authorization', '');
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to check end date rotation to archive employee', async () => {
      logger.info(
        '========== should be able to check end date rotation to archive employee ==========',
      );

      await testService.createEmployeeWithEndDate('2024-5-4');

      jest
        .useFakeTimers({ advanceTimers: true })
        .setSystemTime(new Date(2024, 4, 5));

      const currentDate = new Date();
      console.log('system faked time: ', currentDate);

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/end-date`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(response.body);
      console.log(response.body.data.employees);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.employees).toBeDefined();

      jest.useRealTimers();
    });

    it('should be none employee to archive when check end date rotation not match', async () => {
      logger.info(
        '========== should be none employee to archive when check end date rotation not match ==========',
      );

      await testService.createEmployeeWithEndDate('2024-5-10');

      jest
        .useFakeTimers({ advanceTimers: true })
        .setSystemTime(new Date(2024, 4, 1));

      console.log(
        'current date in test: ',
        new Date().toLocaleString('id-ID', { dateStyle: 'short' }),
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/end-date`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(response.body);

      const mockEmptyEmployeesResult: EmployeeDto[] = [];

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.employees).toEqual(mockEmptyEmployeesResult);

      jest.useRealTimers();
    });

    it('should be able to return empty array when no records in database', async () => {
      logger.info(
        '========== should be able to return empty array when no records in database ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const response = await request(app.getHttpServer())
        .patch(`/api/auth/rotation/check/end-date`)
        .set('Authorization', `Bearer ${loginResponse.token}`);
      logger.info(response.body);

      const mockEmptyEmployeesResult: EmployeeDto[] = [];

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body.data.employees).toEqual(mockEmptyEmployeesResult);
    });
  });

  // describe('PATCH /api/auth/rotation/check/effective-date-and-update-employee', () => {
  //   beforeEach(async () => {
  //     await testService.deleteUser();
  //     await testService.deleteEmployee();
  //   });

  //   it('should be rejected if no authenticated user', async () => {
  //     logger.info(
  //       '========== should be rejected if no authenticated user ==========',
  //     );

  //     const loginData: LoginDto = {
  //       id: '111111',
  //       password: 'admin123',
  //     };
  //     const loginResponse = await testService.loginUser(loginData);
  //     expect(loginResponse.token).toBeDefined();

  //     const newEmployeeResponse = await request(app.getHttpServer())
  //       .patch(`/api/auth/rotation/check/effective-date-and-update-employee`)
  //       .set('Authorization', '');
  //     logger.info(newEmployeeResponse.body);

  //     expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
  //     expect(newEmployeeResponse.body.errors).toBeDefined();
  //   });

  //   it('should be able to update employee when effective date is match with current date', async () => {
  //     logger.info(
  //       '========== should be able to update employee when effective date is match with current date ==========',
  //     );

  //     await testService.createEmployeeWithSettedRotation();

  //     const loginData: LoginDto = {
  //       id: '111111',
  //       password: 'admin123',
  //     };
  //     const loginResponse = await testService.loginUser(loginData);
  //     expect(loginResponse.token).toBeDefined();

  //     jest
  //       .useFakeTimers({ advanceTimers: true })
  //       .setSystemTime(new Date(2024, 4, 5));

  //     const response = await request(app.getHttpServer())
  //       .patch(`/api/auth/rotation/check/effective-date-and-update-employee`)
  //       .set('Authorization', `Bearer ${loginResponse.token}`);
  //     logger.info(response.body);

  //     expect(response.status).toBe(HttpStatus.OK);
  //     expect(response.body.data.employees).toBeDefined();

  //     jest.useRealTimers();
  //   });
  // });
});
