import { z } from 'zod';

export const fileCategorySchema = z
  .object({
    name: z.string().min(1),
  })
  .required();

export type FileCategoryInputs = z.infer<typeof fileCategorySchema>;
