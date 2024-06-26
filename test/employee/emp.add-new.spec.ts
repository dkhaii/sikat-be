import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppModule } from '../../src/app.module';
import { TestModule } from '../test.module';
import { TestService } from '../test.service';
import { Logger } from 'winston';
import { LoginDto } from '../../src/auth/dto/login.dto';
import { AddNewEmployeeDto } from '../../src/employee/dto/add-new-employee.dto';
import { Positions } from '../../src/employee/enums/position.enum';
import { Crews } from '../../src/employee/enums/crew.enum';
import { Pits } from '../../src/employee/enums/pit.enum';
import { Bases } from '../../src/employee/enums/base.enum';
import { CreateRotationDto } from '../../src/rotation/dto/create-rotation.dto';

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

  describe('POST /api/auth/employees', () => {
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

      const newEmployeeData: AddNewEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
      };

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post('/api/auth/employees')
        .set('Authorization', '')
        .send({ empDto: newEmployeeData, rtnDto: newRotation });
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
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

      const newEmployeeData: AddNewEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
      };

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post('/api/auth/employees')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send({ empDto: newEmployeeData, rtnDto: newRotation });
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if request is invalid', async () => {
      logger.info(
        '========== should be rejected if request is invalid ==========',
      );

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeData: AddNewEmployeeDto = {
        id: '',
        name: '',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: null,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
      };

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post('/api/auth/employees')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send({ empDto: newEmployeeData, rtnDto: newRotation });
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if employee is exist', async () => {
      logger.info(
        '========== should be rejected if employee is exist ==========',
      );

      await testService.createEmployee();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeData: AddNewEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
      };

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post('/api/auth/employees')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send({ empDto: newEmployeeData, rtnDto: newRotation });
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.BAD_REQUEST);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be able to add new employee', async () => {
      logger.info('========== should be able to add new employee ==========');

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newEmployeeData: AddNewEmployeeDto = {
        id: 'zs8565',
        name: 'Mordekhai Gerin',
        profilePicture: 'Mordekhai',
        dateOfBirth: new Date(),
        dateOfHire: new Date(),
        positionID: Positions.GDP,
        crewID: Crews.ALPHA,
        pitID: Pits.BINTANG,
        baseID: Bases.M2,
      };

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(),
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post('/api/auth/employees')
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send({ empDto: newEmployeeData, rtnDto: newRotation });
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.employee).toBeDefined();
      expect(newEmployeeResponse.body.data.rotation).toBeDefined();
    });
  });
});
