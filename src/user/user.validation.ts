import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly ADDNEW: ZodType = z.object({
    id: z.string().min(4).max(100),
    password: z.string().min(4).max(100),
    name: z.string().min(2).max(100),
    role: z.number().min(1).max(3),
  });

  static readonly LOGIN: ZodType = z.object({
    id: z.string().min(4).max(100),
    password: z.string().min(4).max(100),
  });
}
