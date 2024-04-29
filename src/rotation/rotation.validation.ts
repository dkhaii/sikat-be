import { z, ZodType } from 'zod';

export class RotationValidation {
  // body payload validation when creating new
  static readonly CREATE: ZodType = z.object({
    effectiveDate: z.string().optional(),
    endDate: z.string().optional(),
    positionID: z.number().optional(),
    crewID: z.number().optional(),
    pitID: z.number().optional(),
    baseID: z.number().optional(),
  });
}
