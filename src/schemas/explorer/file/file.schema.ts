import { z } from 'zod';

export const fileSchema = z
  .object({
    filename: z.string().min(1),
    file: z.instanceof(globalThis.File).refine((file) => file.size > 0, {
      message: 'File must not be empty',
    }),
    category: z.string().min(1),
  })
  .required();

export type FileInputs = z.infer<typeof fileSchema>;
