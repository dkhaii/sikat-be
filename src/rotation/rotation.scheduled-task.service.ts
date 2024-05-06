import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from '../employee/dto/update-employee.dto';
import { RotationService } from '../rotation/rotation.service';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeLogService } from '../employee-log/employee-log.service';
import { CreateEmployeeLogDto } from '../employee-log/dto/create-employee-log.dto';
import { EmployeeDto } from '../employee/dto/employee.dto';
import { EmployeeLogDto } from '../employee-log/dto/employee-log.dto';
import { HelperService } from '../common/helper.service';
import { RotationDto } from './dto/rotation.dto';

@Injectable()
export class RotationScheduledTaskService {
  constructor(
    private rotationService: RotationService,
    private employeeService: EmployeeService,
    private employeeLogService: EmployeeLogService,
    private helper: HelperService,
  ) {}

  private currentDate = new Date().valueOf();

  async checkArchiveEndDate(): Promise<EmployeeDto[]> {
    console.log('current date in rotation service: ', this.currentDate);

    const rotations = await this.rotationService.showAll();

    if (rotations.length == 0) {
      return [];
    }

    console.log('current date: ', this.currentDate);

    const archivedEmployees: EmployeeDto[] = [];

    for (let i = 0; i < rotations.length; i++) {
      console.log(
        rotations[i].endDate &&
          rotations[i].endDate.valueOf() <= this.currentDate,
      );

      if (
        rotations[i].endDate &&
        rotations[i].endDate.valueOf() <= this.currentDate
      ) {
        const updateArchiveStatus: UpdateEmployeeDto = {
          isArchived: true,
          updatedAt: new Date(),
        };

        const updatedEmployee = await this.employeeService.update(
          rotations[i].employeeID,
          updateArchiveStatus,
        );
        if (updatedEmployee) {
          await this.rotationService.remove(rotations[i].employeeID);

          archivedEmployees.push(updatedEmployee);
        }
      }
    }

    console.log('archived employees: ', archivedEmployees);

    return archivedEmployees;
  }

  async checkEffectiveDateAndUpdateEmployee(): Promise<
    [EmployeeDto[], EmployeeDto[], EmployeeLogDto[]]
  > {
    const rotations = await this.rotationService.showAll();
    console.log('isi rotations data: ', rotations);

    if (rotations.length == 0) {
      return [[], [], []];
    }

    const updatedEmployeeData: EmployeeDto[] = [];
    const unarchivedEmployeeData: EmployeeDto[] = [];
    const createdEmployeeLogData: EmployeeLogDto[] = [];

    for (let i = 0; i < rotations.length; i++) {
      console.log(rotations[i].effectiveDate.valueOf() == new Date().valueOf());
      const updateEmpDto = this.validateNotNullRotation(rotations[i]);
      console.log('isi dto update employee: ', updateEmpDto);

      const oldEmployeeData = await this.employeeService.findOneByIDNoFilter(
        rotations[i].employeeID,
      );
      console.log('isi old employee: ', oldEmployeeData);
      if (
        rotations[i].effectiveDate &&
        rotations[i].effectiveDate.valueOf() <= this.currentDate
      ) {
        if (Object.keys(updateEmpDto).length > 0) {
          const updatedEmployee = await this.employeeService.update(
            rotations[i].employeeID,
            updateEmpDto,
          );
          console.log('updated employee: ', updatedEmployee);
          if (updatedEmployee) {
            const createdAt = this.helper.dateNow();
            const employeeLog: CreateEmployeeLogDto = {
              employeeID: rotations[i].employeeID,
              position: oldEmployeeData.positionName,
              crew: oldEmployeeData.crewName,
              pit: oldEmployeeData.pitName,
              base: oldEmployeeData.baseName,
              createdAt: createdAt,
            };
            console.log('isi employee log: ', employeeLog);
            const createdEmployeeLog =
              await this.employeeLogService.create(employeeLog);
            console.log('isi created employee log: ', createdEmployeeLog);
            if (createdEmployeeLog) {
              await this.rotationService.remove(rotations[i].employeeID);
              createdEmployeeLogData.push(createdEmployeeLog);
            }
            updatedEmployeeData.push(updatedEmployee);
          }
        }

        if (
          Object.keys(updateEmpDto).length == 0 &&
          oldEmployeeData.isArchived == true
        ) {
          const updateArchiveStatus: UpdateEmployeeDto = {
            isArchived: false,
          };
          const updatedArchivedStatus = await this.employeeService.update(
            rotations[i].employeeID,
            updateArchiveStatus,
          );
          console.log(
            'isi updated employee archived status: ',
            updatedArchivedStatus,
          );
          if (updatedArchivedStatus) {
            await this.rotationService.remove(rotations[i].employeeID);

            unarchivedEmployeeData.push(updatedArchivedStatus);
          }
        }
      }
      if (
        rotations[i].effectiveDate &&
        rotations[i].effectiveDate.valueOf() <= this.currentDate == false
      ) {
        return [[], [], []];
      }
    }

    console.log('updated employee data: ', updatedEmployeeData);
    console.log('unarchived employee data: ', unarchivedEmployeeData);
    console.log('created employee log data: ', createdEmployeeLogData);

    return [
      updatedEmployeeData,
      unarchivedEmployeeData,
      createdEmployeeLogData,
    ];
  }

  private validateNotNullRotation(rotation: RotationDto): UpdateEmployeeDto {
    const updateEmpDto: UpdateEmployeeDto = {};

    if (rotation.positionID !== null) {
      updateEmpDto.positionID = rotation.positionID;
    }
    if (rotation.crewID !== null) {
      updateEmpDto.crewID = rotation.crewID;
    }
    if (rotation.pitID !== null) {
      updateEmpDto.pitID = rotation.pitID;
    }
    if (rotation.baseID !== null) {
      updateEmpDto.baseID = rotation.baseID;
    }

    return updateEmpDto;
  }
}
