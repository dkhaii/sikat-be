import { Bases, Crews, Pits, Positions } from '@prisma/client';

export class Employee {
  id: string;
  name: string;
  profilePicture: string;
  dateOfBirth: Date;
  dateOfHire: Date;
  positionID: number;
  crewID?: number;
  pitID?: number;
  baseID?: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  position?: Positions;
  crew?: Crews;
  pit?: Pits;
  base?: Bases;
}
