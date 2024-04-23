import { z, ZodType } from 'zod';

export class EmployeeValidation {
  // body payload validation when creating new
  static readonly ADDNEW: ZodType = z.object({
    id: z.string().min(4),
    name: z.string().min(2),
    profilePicture: z.string().optional(),
    dateOfBirth: z.string(),
    positionID: z.number(),
    crewID: z.number().optional(),
    pitID: z.number().optional(),
    baseID: z.number().optional(),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(2).optional(),
    profilePicture: z.string().optional(),
    dateOfBirth: z.string().optional(),
    positionID: z.number().optional(),
    crewID: z.number().optional(),
    pitID: z.number().optional(),
    baseID: z.number().optional(),
  });
}
