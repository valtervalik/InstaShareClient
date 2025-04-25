import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email().min(1),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        'Password must contain at least one uppercase letter, one number, and one special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords must match',
  });

export type SignUpInputs = z.infer<typeof signUpSchema>;
