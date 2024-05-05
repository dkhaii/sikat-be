import { Injectable } from '@nestjs/common';
import { UpdateEmployeeDto } from '../employee/dto/update-employee.dto';
import { RotationService } from '../rotation/rotation.service';
import { EmployeeService } from '../employee/employee.service';
import { EmployeeLogService } from '../employee-log/employee-log.service';
import { CreateEmployeeLogDto } from '../employee-log/dto/create-employee-log.dto';
import { EmployeeDto } from '../employee/dto/employee.dto';
import { EmployeeLogDto } from '../employee-log/dto/employee-log.dto';
import { HelperService } from '../common/helper.service';

@Injectable()
export class RotationScheduledTaskService {
  constructor(
    private rotationService: RotationService,
    private employeeService: EmployeeService,
    private employeeLogService: EmployeeLogService,
    private helper: HelperService,
  ) {}

  private currentDate = new Date().toLocaleString('id-ID', {
    dateStyle: 'short',
  });

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
          rotations[i].endDate.toLocaleString('id-ID', {
            dateStyle: 'short',
          }) <= this.currentDate,
      );

      if (
        rotations[i].endDate &&
        rotations[i].endDate.toLocaleString('id-ID', { dateStyle: 'short' }) <=
          this.currentDate
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
    [EmployeeDto[], EmployeeLogDto[]]
  > {
    const rotations = await this.rotationService.showAll();

    if (rotations.length == 0) {
      return [[], []];
    }

    const employees: EmployeeDto[] = [];
    const empLogs: EmployeeLogDto[] = [];

    for (let i = 0; i < rotations.length; i++) {
      const updateEmpDto: UpdateEmployeeDto = {
        positionID: rotations[i].positionID,
        crewID: rotations[i].crewID,
        pitID: rotations[i].pitID,
        baseID: rotations[i].baseID,
      };

      const oldEmployeeData = await this.employeeService.findOneByID(
        rotations[i].employeeID,
      );

      if (
        rotations[i].effectiveDate &&
        rotations[i].effectiveDate.toLocaleString('id-ID', {
          dateStyle: 'short',
        }) == this.currentDate
      ) {
        if (updateEmpDto) {
          const updatedEmployee = await this.employeeService.update(
            rotations[i].employeeID,
            updateEmpDto,
          );

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

            const createdEmployeeLog =
              await this.employeeLogService.create(employeeLog);

            if (createdEmployeeLog) {
              await this.rotationService.remove(rotations[i].employeeID);

              empLogs.push(createdEmployeeLog);
            }

            employees.push(updatedEmployee);
          }
        }

        if (oldEmployeeData.isArchived && oldEmployeeData.isArchived == true) {
          const updateArchiveStatus: UpdateEmployeeDto = {
            isArchived: false,
          };
          const updatedArchivedStatus = await this.employeeService.update(
            rotations[i].employeeID,
            updateArchiveStatus,
          );
          if (updatedArchivedStatus) {
            await this.rotationService.remove(rotations[i].employeeID);

            employees.push(updatedArchivedStatus);
          }
        }

        if (
          rotations[i].effectiveDate.toLocaleString('id-ID', {
            dateStyle: 'short',
          }) !== this.currentDate
        ) {
          return [[], []];
        }
      }
    }

    return [employees, empLogs];
  }
}
