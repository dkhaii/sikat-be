import { z, ZodType } from 'zod';

export class UserValidation {
  // body payload validation when creating new
  static readonly ADDNEW: ZodType = z.object({
    id: z.string().min(4).max(100),
    password: z.string().min(4).max(100),
    name: z.string().min(2).max(100),
    roleID: z.number().min(1).max(3),
  });

  // body payload validation when login user
  static readonly LOGIN: ZodType = z.object({
    id: z.string().min(4).max(100),
    password: z.string().min(4).max(100),
  });
}
