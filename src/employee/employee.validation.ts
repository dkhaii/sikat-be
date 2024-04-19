import { z, ZodType } from 'zod';

export class EmployeeValidation {
  static readonly CREATE_EMPLOYEE: ZodType = z.object({
    id: z.string().min(4),
    name: z.string().min(2),
    profilePicture: z.string().optional(),
    dateOfBirth: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  });
}
