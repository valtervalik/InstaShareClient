import { z } from 'zod';

export const loginSchema = z
  .object({
    email: z.string().email().min(1),
    password: z.string().min(1),
  })
  .required();

export type LoginInputs = z.infer<typeof loginSchema>;
