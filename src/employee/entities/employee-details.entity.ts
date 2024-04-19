import { Base } from '../enums/base.enum';
import { Crew } from '../enums/crew.enum';
import { Pit } from '../enums/pit.enum';

export class EmployeeDetails {
  badgeNumber: string;
  dateOfHire: Date;
  crewID: Crew;
  baseID: Base;
  pitID: Pit;
}
