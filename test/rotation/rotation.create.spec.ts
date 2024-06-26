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
import { Pits } from '../../src/employee/enums/pit.enum';
import { UpdateRotationDto } from '../../src/rotation/dto/update-rotation.dto';
import { CreateRotationDto } from 'src/rotation/dto/create-rotation.dto';

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

  describe('POST /api/auth/rotation/set', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.deleteEmployee();
    });

    // const empID = 'zs8565';

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

      const newRotation: UpdateRotationDto = {
        effectiveDate: new Date(2024, 10, 5),
        positionID: Positions.SUPERVISOR,
        pitID: Pits.JUPITER,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/rotation/set/${1}`)
        .set('Authorization', '')
        .send(newRotation);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(newEmployeeResponse.body.errors).toBeDefined();
    });

    it('should be rejected if authenticated user is supervisor', async () => {
      logger.info(
        '========== should be rejected if authenticated user is supervisor ==========',
      );

      await testService.createSupvUser();
      const emp = await testService.createOneEmployeeWithSettedRotation();

      const loginData: LoginDto = {
        id: 'zs8566',
        password: 'zs8566',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newRotation: UpdateRotationDto = {
        effectiveDate: new Date(2024, 10, 5),
        positionID: Positions.SUPERVISOR,
        pitID: Pits.JUPITER,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/rotation/set/${emp.id}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(newRotation);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.FORBIDDEN);
      expect(newEmployeeResponse.body.errors).toBeDefined();

      await testService.deleteEmployeeAndRotation(emp.id);
    });

    it('should be able to update rotation if employeeID already exist', async () => {
      logger.info(
        '========== should be able to update rotation if employeeID already exist ==========',
      );

      const emp = await testService.createOneEmployeeWithSettedRotation();
      console.log(emp);

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newRotation: CreateRotationDto = {
        effectiveDate: new Date(2024, 4, 6),
        positionID: Positions.SUPERVISOR,
        pitID: Pits.JUPITER,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/rotation/set/${emp.id}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(newRotation);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.rotation.employeeID).toBe(emp.id);

      await testService.deleteEmployeeAndRotation(emp.id);
    });

    it('should be able to create rotation', async () => {
      logger.info('========== should be able to create rotation ==========');

      const emp = await testService.createEmployee();

      const loginData: LoginDto = {
        id: '111111',
        password: 'admin123',
      };
      const loginResponse = await testService.loginUser(loginData);
      expect(loginResponse.token).toBeDefined();

      const newRotation: UpdateRotationDto = {
        effectiveDate: new Date(2024, 4, 6),
        positionID: Positions.SUPERVISOR,
        pitID: Pits.JUPITER,
      };

      const newEmployeeResponse = await request(app.getHttpServer())
        .post(`/api/auth/rotation/set/${emp.id}`)
        .set('Authorization', `Bearer ${loginResponse.token}`)
        .send(newRotation);
      logger.info(newEmployeeResponse.body);

      expect(newEmployeeResponse.status).toBe(HttpStatus.OK);
      expect(newEmployeeResponse.body.data.rotation.employeeID).toBe(emp.id);

      await testService.deleteEmployeeAndRotation(emp.id);
    });
  });
});
